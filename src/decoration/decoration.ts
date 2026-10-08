/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { createLineDecoration } from "vscode-ext-decoration";
import { workspace, ThemeColor, OverviewRulerLane, TextEditor, Range, TextEditorDecorationType, Uri, DecorationRenderOptions, window, DecorationOptions } from "vscode";
import { Controller } from "../core/controller";
import { indexOfBookmark } from "../core/operations";
import { DEFAULT_GROUP_ID, MAX_GROUPS } from "../core/constants";
import { getOverviewRulerLaneConfig } from "../utils/overviewRulerLane";
import { Bookmark } from "../core/bookmark";
import { getGroups } from "../core/groups";

export type GroupDecorationMap = Map<number, [TextEditorDecorationType, TextEditorDecorationType]>;

function buildGutterIcon(fillColor: string, borderColor: string): Uri {
    return Uri.parse(
        `data:image/svg+xml,${encodeURIComponent(
            `<?xml version="1.0" ?><svg height="16px" version="1.1" viewBox="0 0 16 16" width="16px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" id="Page-1" stroke="${borderColor}" stroke-width="1"><g fill="${fillColor}" id="icon-18-bookmark"><path d="m6.6319,2.13334c-0.82764,0 -1.49857,0.67089 -1.49857,1.49555l0,10.50444l2.99999,-3l3,3l0,-10.50444c0,-0.82597 -0.67081,-1.49555 -1.49858,-1.49555l-3.00285,0z" id="bookmark"/></g></g></svg>`,
        )}`,
    );
}

export function buildGroupGutterIcon(fillColor: string, borderColor: string): Uri {
    return buildGutterIcon(fillColor, borderColor);
}

function createGutterRulerDecoration(
    overviewRulerLane: OverviewRulerLane | undefined,
    overviewRulerColor: string | ThemeColor,
    gutterIconPath: Uri): TextEditorDecorationType {

    const decorationOptions: DecorationRenderOptions = {
        gutterIconPath,
        overviewRulerLane,
        overviewRulerColor: overviewRulerLane !== undefined ? overviewRulerColor : undefined,
        isWholeLine: false
    };

    return window.createTextEditorDecorationType(decorationOptions);
}

export function createBookmarkLabelInlineDecoration(): TextEditorDecorationType {
    const bookmarksLabelInlineMargin = workspace.getConfiguration("bookmarks").get("label.inline.margin", 2);
    const labelInlineFontStyle = workspace.getConfiguration("bookmarks").get("label.inline.fontStyle", "normal");
    const bookmarksLabelInlineFontWeight = workspace.getConfiguration("bookmarks").get("label.inline.fontWeight", 400);

    const decorationOptions: DecorationRenderOptions = {
        after: {
            fontStyle: labelInlineFontStyle,
            color: new ThemeColor("bookmarks.labelInlineMessageTextColor"),
            backgroundColor: new ThemeColor("bookmarks.labelInlineMessageBackgroundColor"),
            textDecoration: `none;margin:0 0 0 ${bookmarksLabelInlineMargin}ch;` +
                            `font-weight:${bookmarksLabelInlineFontWeight}`
        }
    };
    return window.createTextEditorDecorationType(decorationOptions);
}

export function createBookmarkDecorationsForGroups(): GroupDecorationMap {
    const overviewRulerColor = new ThemeColor("bookmarks.overviewRuler");
    const lineBackground = new ThemeColor("bookmarks.lineBackground");
    const lineBorder = new ThemeColor("bookmarks.lineBorder");
    const overviewRulerLane = getOverviewRulerLaneConfig();

    const map: GroupDecorationMap = new Map();
    for (const group of getGroups()) {
        const iconPath = buildGutterIcon(group.color, group.borderColor);
        const gutterDecoration = createGutterRulerDecoration(overviewRulerLane, overviewRulerColor, iconPath);
        const lineDecoration = createLineDecoration(lineBackground, lineBorder);
        map.set(group.id, [gutterDecoration, lineDecoration]);
    }
    return map;
}

export function disposeGroupDecorations(map: GroupDecorationMap): void {
    for (const pair of map.values()) {
        pair[0].dispose();
        pair[1].dispose();
    }
    map.clear();
}

function buildDecorationOptionsForInlineBookmarkLabel(
    activeEditor: TextEditor,
    bookmark: Bookmark,
): DecorationOptions {
    const elementLineRange = activeEditor.document.lineAt(bookmark.line).range;
    const decorationOptionsForLabel: DecorationOptions = {
        range: new Range(
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
    groupDecorations: GroupDecorationMap,
    bookmarkLabelInlineDecoration: TextEditorDecorationType,
) {
    if (!activeEditor) {
        return;
    }

    if (!bookmarks.activeFile) {
        return;
    }

    const clearAll = () => {
        for (const pair of groupDecorations.values()) {
            activeEditor.setDecorations(pair[0], []);
            activeEditor.setDecorations(pair[1], []);
        }
        activeEditor.setDecorations(bookmarkLabelInlineDecoration, []);
    };

    if (bookmarks.activeFile.bookmarks.length === 0) {
        clearAll();
        return;
    }

    // Remove all bookmarks if active file is empty
    if (activeEditor.document.lineCount === 1 && activeEditor.document.lineAt(0).text === "") {
        bookmarks.activeFile.bookmarks = [];
        clearAll();
        return;
    }

    const bookmarksLabelInlineEnabled = workspace.getConfiguration("bookmarks").get("label.inline.enabled", false);

    const rangesByGroup: Map<number, Range[]> = new Map();
    const decorationOptionsForLabels: DecorationOptions[] = [];
    const invalids: Bookmark[] = [];

    for (const bookmark of bookmarks.activeFile.bookmarks) {
        if (bookmark.line <= activeEditor.document.lineCount) {
            const groupId = (bookmark.groupId && groupDecorations.has(bookmark.groupId))
                ? bookmark.groupId
                : DEFAULT_GROUP_ID;
            const ranges = rangesByGroup.get(groupId) ?? [];
            ranges.push(new Range(bookmark.line, 0, bookmark.line, 0));
            rangesByGroup.set(groupId, ranges);

            if (bookmarksLabelInlineEnabled && bookmark.label !== undefined && bookmark.label.length > 0) {
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
        for (const element of invalids) {
            const idxInvalid = indexOfBookmark(bookmarks.activeFile, element.line);
            if (idxInvalid > -1) {
                bookmarks.activeFile.bookmarks.splice(idxInvalid, 1);
            }
        }
    }

    for (let id = 0; id < MAX_GROUPS; id++) {
        const pair = groupDecorations.get(id);
        if (!pair) {
            continue;
        }
        const ranges = rangesByGroup.get(id) ?? [];
        activeEditor.setDecorations(pair[0], ranges);
        activeEditor.setDecorations(pair[1], ranges);
    }

    activeEditor.setDecorations(bookmarkLabelInlineDecoration, decorationOptionsForLabels);
}
