/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Command, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { DEFAULT_GROUP_ID } from "../core/constants";
import { File } from "../core/file";
import { getGroup } from "../core/groups";
import { BookmarkNodeKind } from "./nodes";
import { buildGroupGutterIcon } from "../decoration/decoration";

export interface BookmarkPreview {
    file: string;
    line: number;
    column: number;
    preview: string;
    uri: Uri;
    groupId: number;
}

export class BookmarkNode extends TreeItem {

    constructor(
        public readonly label: string,
        public readonly relativePath: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public readonly kind: BookmarkNodeKind,
        public readonly bookmark: File,
        public readonly books?: BookmarkPreview[],
        public readonly command?: Command,
        public readonly groupId: number = DEFAULT_GROUP_ID
    ) {
        super(label, collapsibleState);

        this.description = relativePath;
        const group = getGroup(groupId);
        this.iconPath = buildGroupGutterIcon(group.color, group.borderColor);
        this.contextValue = "BookmarkNodeBookmark";
    }
}
