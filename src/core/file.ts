/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Uri } from "vscode";
import { Bookmark } from "./bookmark";
// import { UNTITLED_SCHEME } from "./constants";

export interface File {
    path: string;
    bookmarks: Bookmark[];
    uri?: Uri;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileList extends Array<File> { }

export function createFile(filePath: string, uri?: Uri): File {

    // let newUri: Uri = uri;
    // if (uri?.scheme === UNTITLED_SCHEME) {
    //     newUri = Uri.parse(`${UNTITLED_SCHEME}:${uri.path}`)
    // }

    const newFile: File = {
        path: filePath,
        bookmarks: [],
        uri//: newUri
    }
    return newFile;
}