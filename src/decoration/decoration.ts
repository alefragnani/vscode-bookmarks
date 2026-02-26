/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { createLineDecoration } from "vscode-ext-decoration";
import { workspace, ThemeColor, OverviewRulerLane, TextEditor, Range, TextEditorDecorationType, Uri, DecorationRenderOptions, window } from "vscode";
import { Controller } from "../core/controller";
import { indexOfBookmark } from "../core/operations";
import { DEFAULT_GUTTER_ICON_BORDER_COLOR, DEFAULT_GUTTER_ICON_FILL_COLOR } from "../core/constants";
import { getOverviewRulerLaneConfig } from "../utils/overviewRulerLane";

function createGutterRulerDecoration(
    overviewRulerLane?: OverviewRulerLane,
    overviewRulerColor?: string | ThemeColor,
    gutterIconPath?: string | Uri): TextEditorDecorationType {

    const decorationOptions: DecorationRenderOptions = {
        gutterIconPath,
        overviewRulerLane,
        overviewRulerColor: overviewRulerLane !== undefined ? overviewRulerColor : undefined
    };

    decorationOptions.isWholeLine = false;

    return window.createTextEditorDecorationType(decorationOptions);
}

export function createBookmarkDecorations(): TextEditorDecorationType[] {
    const iconFillColor = workspace.getConfiguration("bookmarks").get("gutterIconFillColor", DEFAULT_GUTTER_ICON_FILL_COLOR);
    const iconBorderColor = workspace.getConfiguration("bookmarks").get("gutterIconBorderColor", DEFAULT_GUTTER_ICON_BORDER_COLOR);
    const iconPath = Uri.parse(
        `data:image/svg+xml,${encodeURIComponent(
            `<?xml version="1.0" ?><svg height="16px" version="1.1" viewBox="0 0 16 16" width="16px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" id="Page-1" stroke="${iconBorderColor}" stroke-width="1"><g fill="${iconFillColor}" id="icon-18-bookmark"><path d="m6.6319,2.13334c-0.82764,0 -1.49857,0.67089 -1.49857,1.49555l0,10.50444l2.99999,-3l3,3l0,-10.50444c0,-0.82597 -0.67081,-1.49555 -1.49858,-1.49555l-3.00285,0z" id="bookmark"/></g></g></svg>`,
        )}`,
    );
    
    const overviewRulerColor = new ThemeColor('bookmarks.overviewRuler');
    const lineBackground = new ThemeColor('bookmarks.lineBackground');
    const lineBorder = new ThemeColor('bookmarks.lineBorder');

    const overviewRulerLane = getOverviewRulerLaneConfig();

    const gutterDecoration = createGutterRulerDecoration(overviewRulerLane, overviewRulerColor, iconPath);
    const lineDecoration = createLineDecoration(lineBackground, lineBorder);
    return [gutterDecoration, lineDecoration];
}

export function updateDecorationsInActiveEditor(activeEditor: TextEditor, bookmarks: Controller,
    bookmarkDecorationType: TextEditorDecorationType[]) {
    if (!activeEditor) {
        return;
    }

    if (!bookmarks.activeFile) {
        return;
    }

    if (bookmarks.activeFile.bookmarks.length === 0) {
        const bks: Range[] = [];
      
        bookmarkDecorationType.forEach(d => activeEditor.setDecorations(d, bks));
        return;
    }

    const books: Range[] = [];

    // Remove all bookmarks if active file is empty
    if (activeEditor.document.lineCount === 1 && activeEditor.document.lineAt(0).text === "") {
        bookmarks.activeFile.bookmarks = [];
    } else {
        const invalids = [];
        for (const element of bookmarks.activeFile.bookmarks) {

            if (element.line <= activeEditor.document.lineCount) { 
                const decoration = new Range(element.line, 0, element.line, 0);
                books.push(decoration);
            } else {
                invalids.push(element);
            }
        }

        if (invalids.length > 0) {
            let idxInvalid: number;
            for (const element of invalids) {
                idxInvalid = indexOfBookmark(bookmarks.activeFile, element); 
                bookmarks.activeFile.bookmarks.splice(idxInvalid, 1);
            }
        }
    }
    bookmarkDecorationType.forEach(d => activeEditor.setDecorations(d, books));
}