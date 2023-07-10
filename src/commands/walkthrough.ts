/*----------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*---------------------------------------------------------------------------------------------*/

import { commands } from "vscode";
import { Container } from "../../vscode-bookmarks-core/src/container";

function openSideBar() {
    commands.executeCommand("bookmarksExplorer.focus");
}

export function registerWalkthrough() {
    Container.context.subscriptions.push(commands.registerCommand("_bookmarks.openSideBar", () => openSideBar()))
}

