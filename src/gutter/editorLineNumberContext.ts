/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Uri, commands } from "vscode";
import { File } from "../../vscode-bookmarks-core/src/file";

export interface EditorLineNumberContextParams {
    lineNumber: number,
    uri: Uri
}

export function updateLinesWithBookmarkContext(activeFile: File) {
    const linesWithBookmarks = activeFile.bookmarks.map(b => b.line + 1);

    commands.executeCommand("setContext", "bookmarks.linesWithBookmarks",
        linesWithBookmarks);
}