/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { l10n, TreeItem, TreeItemCollapsibleState } from "vscode";
import { Controller } from "../core/controller";
import { BookmarkGroup } from "../core/groups";
import { buildGroupGutterIcon } from "../decoration/decoration";
import { BookmarkNodeKind } from "./nodes";

export class GroupNode extends TreeItem {

    public readonly kind = BookmarkNodeKind.NODE_GROUP;

    constructor(
        public readonly group: BookmarkGroup,
        public readonly controllers: Controller[],
        public readonly bookmarkCount: number,
        public readonly isActive: boolean,
        collapsibleState: TreeItemCollapsibleState
    ) {
        super(group.name, collapsibleState);

        this.iconPath = buildGroupGutterIcon(group.color, group.borderColor);
        this.contextValue = "BookmarkNodeGroup";

        const parts: string[] = [];
        if (bookmarkCount === 0) {
            parts.push(l10n.t("(empty)"));
        } else {
            parts.push(`${bookmarkCount}`);
        }
        if (isActive) {
            parts.push(l10n.t("(active)"));
        }
        this.description = parts.join(" ");
    }
}
