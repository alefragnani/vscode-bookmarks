/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands } from "vscode";
import { Container } from "../core/container";

export function registerOpenSettings() {
    Container.context.subscriptions.push(commands.registerCommand("bookmarks.openSettings", async () => {
        commands.executeCommand("workbench.action.openSettings", "@ext:alefragnani.bookmarks");
    }));
}