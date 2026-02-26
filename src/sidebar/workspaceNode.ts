/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { TreeItem, TreeItemCollapsibleState, WorkspaceFolder } from "vscode";
import { ThemeIcons } from "vscode-ext-codicons";
import { Controller } from "../core/controller";
import { FileNode } from "./fileNode";
import { BookmarkNodeKind } from "./nodes";

export class WorkspaceNode extends TreeItem {

    constructor(
        public readonly label: string,
        public readonly workspaceFolder: WorkspaceFolder,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public readonly kind: BookmarkNodeKind,
        public readonly files: FileNode[],
        public readonly controller: Controller
    ) {
        super(label, collapsibleState);
        this.iconPath = ThemeIcons.root_folder;
        this.contextValue = "WorkspaceNode";
    }
}