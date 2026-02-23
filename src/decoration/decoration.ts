/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { createLineDecoration } from "vscode-ext-decoration";
import { workspace, ThemeColor, OverviewRulerLane, TextEditor, Range, TextEditorDecorationType, Uri, DecorationRenderOptions, window, DecorationOptions } from "vscode";
import { Controller } from "../core/controller";
import { indexOfBookmark } from "../core/operations";
import { DEFAULT_GUTTER_ICON_BORDER_COLOR, DEFAULT_GUTTER_ICON_FILL_COLOR } from "../core/constants";
import { getOverviewRulerLaneConfig } from "../utils/overviewRulerLane";
import { Bookmark } from "../core/bookmark";

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

export function createBookmarkLabelInlineDecoration(): TextEditorDecorationType {
    const labelInlineMessageMargin = workspace.getConfiguration("bookmarks").get("labelInlineMessageMargin", 2);
    const labelInlineMessageItalic = workspace.getConfiguration("bookmarks").get("labelInlineMessageItalic", false);
    const labelInlineMessageTextColor : string | undefined = workspace.getConfiguration("bookmarks").get("labelInlineMessageTextColor");
    const labelInlineMessageBackgroundColor : string | undefined = workspace.getConfiguration("bookmarks").get("labelInlineMessageBackgroundColor");
    const labelInlineMessageFontWeight = workspace.getConfiguration("bookmarks").get("labelInlineMessageFontWeight", 450);

    const decorationOptions: DecorationRenderOptions = {
        after: {
            fontStyle: labelInlineMessageItalic ? "italic" : undefined,
            color: labelInlineMessageTextColor === undefined || labelInlineMessageTextColor === "" ? new ThemeColor("editorInlayHint.foreground") : undefined,
            backgroundColor: labelInlineMessageBackgroundColor === undefined || labelInlineMessageBackgroundColor === "" ? new ThemeColor("editorInlayHint.background") : undefined,
            textDecoration: `none;margin:0 0 0 ${labelInlineMessageMargin}ch;` +
                            `font-weight:${labelInlineMessageFontWeight}` + 
                            `${labelInlineMessageTextColor === undefined || labelInlineMessageTextColor === "" ? "" : ";color:" + labelInlineMessageTextColor}` +
                            `${labelInlineMessageBackgroundColor === undefined || labelInlineMessageBackgroundColor === "" ? "" : ";background-color:" + labelInlineMessageBackgroundColor}`,
        }
    };
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

function buildDecorationOptionsForInlineBookmarkLabel(
    activeEditor: TextEditor,
    bookmark: Bookmark,
): DecorationOptions {
    const elementLineRange = activeEditor.document.lineAt(bookmark.line).range;
    const decorationOptionsForLabel : DecorationOptions = {
        range : new Range(
            elementLineRange.start.line,
            elementLineRange.end.character,
            elementLineRange.start.line,
            elementLineRange.end.character,
        ),
        renderOptions: {
            after: {
                contentText: bookmark.label,
            }
        },
    };

    return decorationOptionsForLabel;
}

export function updateDecorationsInActiveEditor(
    activeEditor: TextEditor,
    bookmarks: Controller,
    bookmarkDecorationType: TextEditorDecorationType[],
    bookmarkLabelInlineDecoration: TextEditorDecorationType,
) {
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

    const decorationRanges: Range[] = [];
    const decorationOptionsForLabels: DecorationOptions[] = [];

    const enableLabelInlineMessage = workspace.getConfiguration("bookmarks").get("enableLabelInlineMessage", false);

    // Remove all bookmarks if active file is empty
    if (activeEditor.document.lineCount === 1 && activeEditor.document.lineAt(0).text === "") {
        bookmarks.activeFile.bookmarks = [];
    } else {
        const invalids = [];
        for (const bookmark of bookmarks.activeFile.bookmarks) {

            if (bookmark.line <= activeEditor.document.lineCount) { 
                const decorationRange = new Range(bookmark.line, 0, bookmark.line, 0);
                decorationRanges.push(decorationRange);

                if (enableLabelInlineMessage && bookmark.label !== undefined && bookmark.label.length > 0) {
                    decorationOptionsForLabels.push(buildDecorationOptionsForInlineBookmarkLabel(
                        activeEditor,
                        bookmark,
                    ));
                }
            } else {
                invalids.push(bookmark);
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
    // Add common decorations (gutter icons/line highlights)
    bookmarkDecorationType.forEach(d => activeEditor.setDecorations(d, decorationRanges));
    // Add label inline text decorations
    activeEditor.setDecorations(bookmarkLabelInlineDecoration, decorationOptionsForLabels);
}