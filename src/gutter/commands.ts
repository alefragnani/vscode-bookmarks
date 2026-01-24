/*----------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*---------------------------------------------------------------------------------------------*/

import { commands } from "vscode";
import { EditorLineNumberContextParams } from "./editorLineNumberContext";
import { Container } from "../core/container";

export function registerGutterCommands(toggleCommand: (params: EditorLineNumberContextParams) => void, toggleLabeledCommand: (params: EditorLineNumberContextParams) => void) {
    Container.context.subscriptions.push(
        commands.registerCommand("_bookmarks.addBookmarkAtLine#gutter",
            async (params: EditorLineNumberContextParams) => {
                await toggleCommand(params);
            }));

    Container.context.subscriptions.push(
        commands.registerCommand("_bookmarks.addLabeledBookmarkAtLine#gutter",
            async (params: EditorLineNumberContextParams) => {
                await toggleLabeledCommand(params);
            }));

    Container.context.subscriptions.push(
        commands.registerCommand("_bookmarks.removeBookmarkAtLine#gutter",
            async (params: EditorLineNumberContextParams) => {
                await toggleCommand(params);
            }));
}