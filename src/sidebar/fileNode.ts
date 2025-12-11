/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Command, ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { File } from "../core/file";
import { BookmarkPreview } from "./bookmarkNode";
import { BookmarkNodeKind } from "./nodes";

export class FileNode extends TreeItem {

    constructor(
        public readonly label: string,
        public readonly relativePath: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public readonly kind: BookmarkNodeKind,
        public readonly bookmark: File,
        public readonly books?: BookmarkPreview[],
        public readonly command?: Command
    ) {
        super(label, collapsibleState);

        this.resourceUri = Uri.file(bookmark.path);
        this.description = relativePath;
        this.iconPath = ThemeIcon.File;
        this.contextValue = "BookmarkNodeFile";
    }
}