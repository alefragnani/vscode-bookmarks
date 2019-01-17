/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

"use strict";

import * as vscode from "vscode";
import fs = require("fs");

export const NO_BOOKMARKS = -1;
export const NO_MORE_BOOKMARKS = -2;
export const NO_BOOKMARKS_BEFORE = -3;
export const NO_BOOKMARKS_AFTER = -4;

export const JUMP_FORWARD = 1;
export const JUMP_BACKWARD = -1;
export enum JUMP_DIRECTION { JUMP_FORWARD, JUMP_BACKWARD };

/**
 * Declares a single *Bookmark* (line, column and label)
 */
export interface Bookmark {
    line: number;
    column: number;
    label?: string;
}

/**
 * Declares a *File with Bookmarks*, with its `path` and list of `Bookmark`
 */
export interface File {
    path: string;
    bookmarks: Bookmark[];

    nextBookmark(currentPosition: vscode.Position, direction: JUMP_DIRECTION): Promise<number | vscode.Position>;
    listBookmarks();
    clear(): void;
    indexOfBookmark(line: number): number;
    getLinePreview(line: number): Promise<string>;
};

/**
 * Declares a list of `File` (in `Array` form)
 */
export interface FileList extends Array<File> { };

export class BookmarkItem implements Bookmark {

    public line: number;
    public column: number;
    public label: string;

    constructor(line: number, column: number = 1, label: string = "") {
        this.line = line;
        this.column = column;
        this.label = label;
    }
}

export class BookmarkedFile implements File {
    public path: string;
    public bookmarks: Bookmark[];

    constructor(fsPath: string) {
        this.path = fsPath;
        this.bookmarks = [];
    }

    public nextBookmark(currentPosition: vscode.Position, direction: JUMP_DIRECTION = JUMP_FORWARD): Promise<number | vscode.Position> {

        return new Promise((resolve, reject) => {

            if (typeof this.bookmarks === "undefined") {
                reject('typeof this.bookmarks == "undefined"');
                return;
            }

            let navigateThroughAllFiles: boolean;
            navigateThroughAllFiles = vscode.workspace.getConfiguration("bookmarks").get("navigateThroughAllFiles", false);

            if (this.bookmarks.length === 0) {
                if (navigateThroughAllFiles) {
                    resolve(NO_BOOKMARKS);
                    return;
                } else {
                    resolve(currentPosition);
                    return;
                }
            }

            const wrapNavigation: boolean = vscode.workspace.getConfiguration("bookmarks").get("wrapNavigation", true);

            let nextBookmark: vscode.Position;

            if (direction === JUMP_FORWARD) {
                for (let element of this.bookmarks) {
                    if (element.line > currentPosition.line) {
                        nextBookmark = new vscode.Position(element.line, element.column); //.line
                        break;
                    }
                }

                if (typeof nextBookmark === "undefined") {
                    if (navigateThroughAllFiles) {
                        resolve(NO_MORE_BOOKMARKS);
                        return;
                    } else if (!wrapNavigation) {
                        resolve(NO_BOOKMARKS_AFTER);
                        return;
                    } else {
                        resolve(new vscode.Position(this.bookmarks[ 0 ].line, this.bookmarks[ 0 ].column));
                        return;
                    }
                } else {
                    resolve(nextBookmark);
                    return;
                }
            } else { // JUMP_BACKWARD
                for (let index = this.bookmarks.length - 1; index >= 0; index--) {
                    let element = this.bookmarks[ index ];
                    if (element.line < currentPosition.line) {
                        nextBookmark = new vscode.Position(element.line, element.column); //.line
                        break;
                    }
                }
                if (typeof nextBookmark === "undefined") {
                    if (navigateThroughAllFiles) {
                        resolve(NO_MORE_BOOKMARKS);
                        return;
                    } else if (!wrapNavigation) {
                        resolve(NO_BOOKMARKS_BEFORE);
                        return;
                    } else {
                        resolve(new vscode.Position(this.bookmarks[ this.bookmarks.length - 1 ].line, this.bookmarks[ this.bookmarks.length - 1 ].column));
                        return;
                    }
                } else {
                    resolve(nextBookmark);
                    return;
                }
            }
        });
    }

    public listBookmarks() {

        return new Promise((resolve, reject) => {

            // no bookmark, returns empty
            if (this.bookmarks.length === 0) {
                resolve(undefined);
                return;
            }

            // file does not exist, returns empty
            if (!fs.existsSync(this.path)) {
                resolve(undefined);
                return;
            }

            let uriDocBookmark: vscode.Uri = vscode.Uri.file(this.path);
            vscode.workspace.openTextDocument(uriDocBookmark).then(doc => {

                let items = [];
                let invalids = [];
                // tslint:disable-next-line:prefer-for-of
                for (let index = 0; index < this.bookmarks.length; index++) {

                    let bookmarkLine = this.bookmarks[ index ].line + 1;
                    let bookmarkColumn = this.bookmarks[ index ].column + 1;

                    // check for 'invalidated' bookmarks, when its outside the document length
                    if (bookmarkLine <= doc.lineCount) {
                        let lineText = doc.lineAt(bookmarkLine - 1).text.trim();
                        let normalizedPath = doc.uri.fsPath;

                        if (this.bookmarks[index].label === "") {
                            items.push({ description: "(Ln " + bookmarkLine.toString() + ", Col " + 
                                bookmarkColumn.toString() + ")", 
                                label: lineText,
                                detail: normalizedPath });
                        } else {
                            items.push({ description: "(Ln " + bookmarkLine.toString() + ", Col " + 
                                bookmarkColumn.toString() + ")", 
                                // label: lineText,
                                label: "$(tag) " + this.bookmarks[index].label,
                                detail: normalizedPath });
                        }
                    } else {
                        invalids.push(bookmarkLine);
                    }
                }
                if (invalids.length > 0) {
                    let idxInvalid: number;
                    // tslint:disable-next-line:prefer-for-of
                    for (let indexI = 0; indexI < invalids.length; indexI++) {
                        idxInvalid = this.bookmarks.indexOf(<Bookmark>{line: invalids[ indexI ] - 1});
                        this.bookmarks.splice(idxInvalid, 1);
                    }
                }

                resolve(items);
                return;
            });
        });
    }

    public clear() {
        this.bookmarks.length = 0;
    }

    public indexOfBookmark(line: number): number {
        for (let index = 0; index < this.bookmarks.length; index++) {
            const element = this.bookmarks[index];
            if (element.line === line) {
                return index;
            }
        }

        return -1;
    }

    public async getLinePreview(line: number): Promise<string> {
        let uriDocBookmark: vscode.Uri = vscode.Uri.file(this.path);
        let doc = await vscode.workspace.openTextDocument(uriDocBookmark);
        return doc.lineAt(line).text.trim();
    }
}
