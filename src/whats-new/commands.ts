/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands } from "vscode";
import { Container } from "../../vscode-bookmarks-core/src/container";
import { WhatsNewManager } from "../../vscode-whats-new/src/Manager";
import { WhatsNewBookmarksContentProvider } from "./contentProvider";

export function registerWhatsNew() {
    const provider = new WhatsNewBookmarksContentProvider();
    const viewer = new WhatsNewManager(Container.context).registerContentProvider("Bookmarks", provider);
    viewer.showPageInActivation();
    Container.context.subscriptions.push(commands.registerCommand("bookmarks.whatsNew", () => viewer.showPage()));
    Container.context.subscriptions.push(commands.registerCommand("_bookmarks.whatsNewContextMenu", () => viewer.showPage()));
}
