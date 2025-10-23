/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { QuickPickItem, Uri } from "vscode";

export interface Bookmark {
    line: number;
    column: number;
    label?: string;
}

export interface BookmarkQuickPickItem extends QuickPickItem {
    uri: Uri;
}