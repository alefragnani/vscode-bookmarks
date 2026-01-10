/*---------------------------------------------------------------------------------------------
*  Copyright (c) Castellant Guillaume & Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*
*  Original Author: Castellant Guillaume (@Terminux), 
*                   (https://github.com/alefragnani/vscode-bookmarks/pull/20)
*--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Controller } from "../core/controller";
import { File } from "../core/file";
import { indexOfBookmark } from "../core/operations";

export class Sticky {

    public static stickyBookmarks(event: vscode.TextDocumentChangeEvent,
        activeEditorCountLine: number, activeBookmark: File,
        activeEditor: vscode.TextEditor, controller: Controller): boolean {

        let diffLine: number;
        let updatedBookmark = false;

        // fix autoTrimWhitespace
        if (this.HadOnlyOneValidContentChange(event)) {
            // add or delete line case
            if (event.document.lineCount !== activeEditorCountLine) {
                if (event.document.lineCount > activeEditorCountLine) {
                    diffLine = event.document.lineCount - activeEditorCountLine;
                } else if (event.document.lineCount < activeEditorCountLine) {
                    diffLine = activeEditorCountLine - event.document.lineCount;
                    diffLine = 0 - diffLine;

                    // one line up
                    if (event.contentChanges[ 0 ].range.end.line - event.contentChanges[ 0 ].range.start.line === 1) {

                        if ((event.contentChanges[ 0 ].range.end.character === 0) &&
                            (event.contentChanges[ 0 ].range.start.character === 0)) {
                            // the bookmarked one
                            const idxbk = indexOfBookmark(activeBookmark, event.contentChanges[ 0 ].range.start.line); // bookmarks.indexOf({line: event.contentChanges[ 0 ].range.start.line});
                            if (idxbk > -1) {
                                controller.removeBookmark(idxbk, event.contentChanges[ 0 ].range.start.line);
                            }
                        }
                    }

                    if (event.contentChanges[ 0 ].range.end.line - event.contentChanges[ 0 ].range.start.line > 1) {
                        for (let i = event.contentChanges[ 0 ].range.start.line/* + 1*/; i <= event.contentChanges[ 0 ].range.end.line; i++) {
                            const index = indexOfBookmark(activeBookmark, i); // bookmarks.indexOf({line: i});

                            if (index > -1) {
                                controller.removeBookmark(index, i);
                                updatedBookmark = true;
                            }
                        }
                    }
                }

                for (let index = 0; index < activeBookmark.bookmarks.length; index++) {
                    const eventLine: number = event.contentChanges[ 0 ].range.start.line;
                    let eventcharacter: number = event.contentChanges[ 0 ].range.start.character;

                    // indent ?
                    if (eventcharacter > 0) {
                        let textInEventLine = activeEditor.document.lineAt(eventLine).text;
                        textInEventLine = textInEventLine.replace(/\t/g, "").replace(/\s/g, "");
                        if (textInEventLine === "") {
                            eventcharacter = 0;
                        }
                    }

                    // also =
                    if (
                        ((activeBookmark.bookmarks[ index ].line > eventLine) && (eventcharacter > 0)) ||
                        ((activeBookmark.bookmarks[ index ].line >= eventLine) && (eventcharacter === 0))
                    ) {
                        let newLine = activeBookmark.bookmarks[ index ].line + diffLine;
                        if (newLine < 0) {
                            newLine = 0;
                        }

                        controller.updateBookmark(index, activeBookmark.bookmarks[ index ].line, newLine);
                        updatedBookmark = true;
                    }
                }
            }

            // paste case
            if (!updatedBookmark && (event.contentChanges[ 0 ].text.length > 1)) {
                const selection = vscode.window.activeTextEditor.selection;
                const lineRange = [ selection.start.line, selection.end.line ];
                let lineMin = Math.min.apply(this, lineRange);
                let lineMax = Math.max.apply(this, lineRange);

                if (selection.start.character > 0) {
                    lineMin++;
                }

                if (selection.end.character < vscode.window.activeTextEditor.document.lineAt(selection.end).range.end.character) {
                    lineMax--;
                }

                if (lineMin <= lineMax) {
                    for (let i = lineMin; i <= lineMax; i++) {
                        const index = indexOfBookmark(activeBookmark, i); // bookmarks.indexOf({line: i});
                        if (index > -1) {
                            controller.removeBookmark(index, i);
                            updatedBookmark = true;
                        }
                    }
                }
            }
        } else {
            // Remove ident changes. Empty text decrease and only spaces increase
            const moveChanges = event.contentChanges.filter(c => !(c.range.start.line === c.range.end.line && /^[\t ]*$/.test(c.text)));

            if (moveChanges.length === 2) {
                // move line up and move line down case
                if (activeEditor.selections.length === 1) {
                    if (moveChanges[ 0 ].text === "") {
                        updatedBookmark = this.moveStickyBookmarks("down", activeBookmark, activeEditor, controller);
                    } else if (moveChanges[ 1 ].text === "") {
                        updatedBookmark = this.moveStickyBookmarks("up", activeBookmark, activeEditor, controller);
                    }
                }
            }
        }

        return updatedBookmark;
    }

    public static moveStickyBookmarks(direction: string, activeBookmark: File, activeEditor: vscode.TextEditor, controller: Controller): boolean {
        let diffChange = -1;
        let updatedBookmark = false;
        let diffLine;
        const selection = activeEditor.selection;
        let lineRange = [ selection.start.line, selection.end.line ];
        const lineMin = Math.min.apply(this, lineRange);
        let lineMax = Math.max.apply(this, lineRange);

        if (selection.end.character === 0 && !selection.isSingleLine) {
            // const lineAt = activeEditor.document.lineAt(selection.end.line);
            // const posMin = new vscode.Position(selection.start.line + 1, selection.start.character);
            // const posMax = new vscode.Position(selection.end.line, lineAt.range.end.character);
            // vscode.window.activeTextEditor.selection = new vscode.Selection(posMin, posMax);
            lineMax--;
        }

        if (direction === "up") {
            diffLine = 1;

            const index = indexOfBookmark(activeBookmark, lineMin - 1);
            if (index > -1) {
                diffChange = lineMax;
                controller.removeBookmark(index, lineMin - 1);
                updatedBookmark = true;
            }
        } else if (direction === "down") {
            diffLine = -1;

            const index: number = indexOfBookmark(activeBookmark, lineMax + 1);
            if (index > -1) {
                diffChange = lineMin;
                controller.removeBookmark(index, lineMax + 1);
                updatedBookmark = true;
            }
        }

        lineRange = [];
        for (let i = lineMin; i <= lineMax; i++) {
            lineRange.push(i);
        }
        lineRange = lineRange.sort();
        if (diffLine < 0) {
            lineRange = lineRange.reverse();
        }

        for (const i in lineRange) {
            const index = indexOfBookmark(activeBookmark, lineRange[ i ]);
            if (index > -1) {
                controller.updateBookmark(index, lineRange[ i ],
                    activeBookmark.bookmarks[ index ].line - diffLine);
                updatedBookmark = true;
            }
        }

        if (diffChange > -1) {
            controller.addBookmark(new vscode.Position(diffChange, 1)); // ?? recover correct column (removed bookmark)
            updatedBookmark = true;
        }

        return updatedBookmark;
    }

    private static HadOnlyOneValidContentChange(event): boolean {

        // not valid
        if ((event.contentChanges.length > 2) || (event.contentChanges.length === 0)) {
            return false;
        }

        // normal behavior - only 1
        if (event.contentChanges.length === 1) {
            return true;
        } else { // has 2, but is it a trimAutoWhitespace issue?
            if (event.contentChanges.length === 2) {
                const trimAutoWhitespace: boolean = vscode.workspace.getConfiguration("editor", null).get("trimAutoWhitespace", true);
                if (!trimAutoWhitespace) {
                    return false;
                }

                // check if the first range is 'equal' and if the second is 'empty'
                const fistRangeEquals: boolean =
                    (event.contentChanges[ 0 ].range.start.character === event.contentChanges[ 0 ].range.end.character) &&
                    (event.contentChanges[ 0 ].range.start.line === event.contentChanges[ 0 ].range.end.line);

                const secondRangeEmpty: boolean = (event.contentChanges[ 1 ].text === "") &&
                    (event.contentChanges[ 1 ].range.start.line === event.contentChanges[ 1 ].range.end.line) &&
                    (event.contentChanges[ 1 ].range.start.character === 0) &&
                    (event.contentChanges[ 1 ].range.end.character > 0);

                return fistRangeEquals && secondRangeEmpty;
            }
        }
    }
}