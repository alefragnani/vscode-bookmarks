/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands } from "vscode";
import { Container } from "../../vscode-bookmarks-core/src/container";
import { WhatsNewManager } from "../../vscode-whats-new/src/Manager";
import { BookmarksSocialMediaProvider, BookmarksSponsorProvider, BookmarksContentProvider } from "./contentProvider";

export async function registerWhatsNew() {
    const provider = new BookmarksContentProvider();
    const viewer = new WhatsNewManager(Container.context)
        .registerContentProvider("alefragnani", "Bookmarks", provider)
        .registerSocialMediaProvider(new BookmarksSocialMediaProvider())
        .registerSponsorProvider(new BookmarksSponsorProvider());
    await viewer.showPageInActivation();
    Container.context.subscriptions.push(commands.registerCommand("bookmarks.whatsNew", () => viewer.showPage()));
    Container.context.subscriptions.push(commands.registerCommand("_bookmarks.whatsNewContextMenu", () => viewer.showPage()));
}
