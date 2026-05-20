/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Disposable, l10n, StatusBarAlignment, StatusBarItem, ThemeColor, window, workspace, WorkspaceFolder } from "vscode";
import { Container } from "../core/container";
import { getGroup, groupsConfigChanged } from "../core/groups";
import { getActiveGroupId, onDidChangeActiveGroup } from "../core/groupState";

export function registerActiveGroupStatusBar(getActiveWorkspaceFolder: () => WorkspaceFolder | undefined): StatusBarItem {
    const item = window.createStatusBarItem(StatusBarAlignment.Left, 100);
    item.command = "bookmarks.switchActiveGroup";
    item.color = new ThemeColor("statusBarItem.foreground");

    const render = () => {
        const wsf = getActiveWorkspaceFolder();
        const id = getActiveGroupId(wsf);
        const group = getGroup(id);
        item.text = `$(bookmark) ${group.name}`;
        item.tooltip = l10n.t("Active Bookmark Group: {0}. Click to switch.", group.name);
        item.show();
    };

    render();

    const disposables: Disposable[] = [
        item,
        onDidChangeActiveGroup(() => render()),
        window.onDidChangeActiveTextEditor(() => render()),
        workspace.onDidChangeConfiguration(e => {
            if (groupsConfigChanged(e)) {
                render();
            }
        })
    ];

    Container.context.subscriptions.push(...disposables);
    return item;
}
