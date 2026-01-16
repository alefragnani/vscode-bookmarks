/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Position, Uri, workspace, WorkspaceFolder } from "vscode";
import { codicons } from "vscode-ext-codicons";
import { Bookmark, BookmarkQuickPickItem } from "./bookmark";
import { Directions, NO_BOOKMARKS, NO_BOOKMARKS_AFTER, NO_BOOKMARKS_BEFORE, NO_MORE_BOOKMARKS } from "./constants";
import { File } from "./file";
import { uriExists, uriWith } from "../utils/fs";
import { extractLeadingNumber } from "../utils/sortHelpers";

// Get sorted bookmarks based on configuration
function getSortedBookmarks(bookmarks: Bookmark[]): Bookmark[] {
    const sortBy = workspace.getConfiguration("bookmarks").get<string>("sortBy", "line");

    // Create a copy to avoid modifying the original array
    const sorted = [...bookmarks];

    if (sortBy === "label") {
        sorted.sort((n1, n2) => {
            const label1 = n1.label || "";
            const label2 = n2.label || "";

            // Both have no label, sort by line number
            if (!label1 && !label2) {
                return n1.line - n2.line;
            }

            // Labeled bookmarks come first
            if (!label1) return 1;
            if (!label2) return -1;

            // Extract leading numbers for smart sorting
            const num1 = extractLeadingNumber(label1);
            const num2 = extractLeadingNumber(label2);
            const hasNum1 = !isNaN(num1);
            const hasNum2 = !isNaN(num2);

            // Both have leading numbers
            if (hasNum1 && hasNum2) {
                if (num1 !== num2) {
                    return num1 - num2;
                }
                // Same number prefix, sort by full label alphabetically
                return label1.localeCompare(label2);
            }

            // Labels with numbers come before labels without
            if (hasNum1) return -1;
            if (hasNum2) return 1;

            // Both have no leading numbers, sort alphabetically
            return label1.localeCompare(label2);
        });
    } else {
        // Default: sort by line number
        sorted.sort((n1, n2) => n1.line - n2.line);
    }

    return sorted;
}

export function nextBookmark(file: File, currentPosition: Position, direction: Directions): Promise<number | Position> {
    return new Promise((resolve, reject) => {

        if (typeof file.bookmarks === "undefined") {
            reject('typeof file.bookmarks == "undefined"');
            return;
        }

        const navigateThroughAllFiles: boolean = workspace.getConfiguration("bookmarks").get("navigateThroughAllFiles", true);

        if (file.bookmarks.length === 0) {
            if (navigateThroughAllFiles) {
                resolve(NO_BOOKMARKS);
                return;
            } else {
                resolve(currentPosition);
                return;
            }
        }

        const wrapNavigation: boolean = workspace.getConfiguration("bookmarks").get("wrapNavigation", true);

        // Get sorted bookmarks based on configuration
        const sortedBookmarks = getSortedBookmarks(file.bookmarks);

        // Find current bookmark index (if cursor is on a bookmark)
        let currentIndex = -1;
        for (let i = 0; i < sortedBookmarks.length; i++) {
            if (sortedBookmarks[i].line === currentPosition.line) {
                currentIndex = i;
                break;
            }
        }

        let nextIndex: number;

        if (direction === Directions.Forward) {
            if (currentIndex === -1) {
                // Not on a bookmark, jump to first bookmark in array
                nextIndex = 0;
            } else {
                // On a bookmark, jump to next in array
                nextIndex = currentIndex + 1;
            }

            if (nextIndex >= sortedBookmarks.length) {
                if (navigateThroughAllFiles) {
                    resolve(NO_MORE_BOOKMARKS);
                    return;
                } else if (!wrapNavigation) {
                    resolve(NO_BOOKMARKS_AFTER);
                    return;
                } else {
                    // Wrap to first bookmark
                    nextIndex = 0;
                }
            }
        } else { // JUMP_BACKWARD
            if (currentIndex === -1) {
                // Not on a bookmark, jump to last bookmark in array
                nextIndex = sortedBookmarks.length - 1;
            } else {
                // On a bookmark, jump to previous in array
                nextIndex = currentIndex - 1;
            }

            if (nextIndex < 0) {
                if (navigateThroughAllFiles) {
                    resolve(NO_MORE_BOOKMARKS);
                    return;
                } else if (!wrapNavigation) {
                    resolve(NO_BOOKMARKS_BEFORE);
                    return;
                } else {
                    // Wrap to last bookmark
                    nextIndex = sortedBookmarks.length - 1;
                }
            }
        }

        resolve(new Position(sortedBookmarks[nextIndex].line, sortedBookmarks[nextIndex].column));
    });
}

export function listBookmarks(file: File, workspaceFolder: WorkspaceFolder) {

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {

        // no bookmark, returns empty
        if (file.bookmarks.length === 0) {
            resolve(undefined);
            return;
        }

        let uriDocBookmark: Uri;
        if (file.uri) {
            uriDocBookmark = file.uri;
        } else {
            if (!workspaceFolder) {
                uriDocBookmark = Uri.file(file.path);
            } else {
                const prefix = workspaceFolder.uri.path.endsWith("/")
                    ? workspaceFolder.uri.path
                    : `${workspaceFolder.uri.path}/`;
                uriDocBookmark = uriWith(workspaceFolder.uri, prefix, file.path);
            }
        }

        // file does not exist, returns empty
        if (! await uriExists(uriDocBookmark)) {
            resolve(undefined);
            return;
        }

        // const uriDocBookmark: Uri = Uri.file(file.path);
        workspace.openTextDocument(uriDocBookmark).then(doc => {

            const items: BookmarkQuickPickItem[] = [];
            const invalids = [];
            for (let index = 0; index < file.bookmarks.length; index++) {

                const bookmarkLine = file.bookmarks[ index ].line + 1;
                const bookmarkColumn = file.bookmarks[ index ].column + 1;

                // check for 'invalidated' bookmarks, when its outside the document length
                if (bookmarkLine <= doc.lineCount) {
                    const lineText = doc.lineAt(bookmarkLine - 1).text.trim();
                    // const normalizedPath = doc.uri.fsPath;

                    if (file.bookmarks[ index ].label === "") {
                        items.push({
                            description: "(Ln " + bookmarkLine.toString() + ", Col " +
                                bookmarkColumn.toString() + ")",
                            label: lineText,
                            detail: file.path,
                            uri: uriDocBookmark
                        });
                    } else {
                        items.push({
                            description: "(Ln " + bookmarkLine.toString() + ", Col " +
                                bookmarkColumn.toString() + ")",
                            label: codicons.tag + " " + file.bookmarks[ index ].label,
                            detail: file.path,
                            uri: uriDocBookmark
                        });
                    }
                } else {
                    invalids.push(bookmarkLine);
                }
            }
            if (invalids.length > 0) {
                let idxInvalid: number;
                for (let indexI = 0; indexI < invalids.length; indexI++) {
                    idxInvalid = file.bookmarks.indexOf(<Bookmark>{ line: invalids[ indexI ] - 1 });
                    file.bookmarks.splice(idxInvalid, 1);
                }
            }

            resolve(items);
            return;
        });
    });
}

export function clear(file: File): void {
    file.bookmarks.length = 0;
}

export function indexOfBookmark(file: File, line: number): number {
    for (let index = 0; index < file.bookmarks.length; index++) {
        const element = file.bookmarks[ index ];
        if (element.line === line) {
            return index;
        }
    }

    return -1;
}

export async function getLinePreview(uri: Uri, line: number): Promise<string> {
    // const uriDocBookmark: Uri = Uri.file(file.path);
    const doc = await workspace.openTextDocument(uri);
    return doc.lineAt(line).text.trim();
}

export function sortBookmarks(file: File): void {
    file.bookmarks.sort((n1, n2) => {
        if (n1.line > n2.line) {
            return 1;
        }
        if (n1.line < n2.line) {
            return -1;
        }
        return 0;
    });
}
