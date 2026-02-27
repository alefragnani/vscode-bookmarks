/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Bookmark } from "../core/bookmark";
import { Controller } from "../core/controller";
import { File } from "../core/file";
import { indexOfBookmark } from "../core/operations";


export function registerEditBookmarkNote(controllers: Controller[]) {
    vscode.commands.registerCommand("_bookmarks.editBookmarkNote", async (node) => {
        // 1. Identify Controller and Bookmark
        // The command might be triggered from:
        // a) Sidebar Context Menu (node is BookmarkNode)
        // b) Editor Context Menu / Command Palette (needs active editor resolution)

        let controller: Controller;
        let file: File;
        let bookmarkIndex: number;
        let bookmark: Bookmark;


        if (node && node.command && node.command.arguments) {
            const [filePath, line, col, uri] = node.command.arguments;
            const uriObj = uri;

            // Find controller
            for (const c of controllers) {
                if (c.fromUri(uriObj)) {
                    controller = c;
                    break;
                }
            }

            if (!controller) {
                return;
            }

            file = controller.fromUri(uriObj);
            bookmarkIndex = indexOfBookmark(file, line - 1);
        } else {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                for (const c of controllers) {
                    if (c.fromUri(editor.document.uri)) {
                        controller = c;
                        break;
                    }
                }

                if (controller) {
                    file = controller.fromUri(editor.document.uri);
                    bookmarkIndex = indexOfBookmark(file, editor.selection.active.line);
                }
            }
        }

        if (!controller || !file || bookmarkIndex === -1) {
            vscode.window.showInformationMessage("No bookmark found at current line.");
            return;
        }

        bookmark = file.bookmarks[bookmarkIndex];

        // Construct URI
        // Using JSON stringify for query to handle spaces/special chars safely
        const query = JSON.stringify({
            path: file.path,
            line: bookmark.line
        });

        const uri = vscode.Uri.parse(`vscode-bookmarks-note:/Note.md?${query}`);

        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc, { preview: false });
    });
}
