/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Event, EventEmitter, WorkspaceFolder } from "vscode";
import { Container } from "./container";
import { DEFAULT_GROUP_ID, MAX_GROUPS } from "./constants";

const GLOBAL_SCOPE_KEY = "__global__";

function storageKey(workspaceFolder: WorkspaceFolder | undefined): string {
    const scope = workspaceFolder ? workspaceFolder.uri.toString() : GLOBAL_SCOPE_KEY;
    return `bookmarks.activeGroupId.${scope}`;
}

const emitter = new EventEmitter<number>();

export const onDidChangeActiveGroup: Event<number> = emitter.event;

export function getActiveGroupId(workspaceFolder?: WorkspaceFolder): number {
    const stored = Container.context.workspaceState.get<number>(storageKey(workspaceFolder), DEFAULT_GROUP_ID);
    if (!Number.isFinite(stored) || stored < 0 || stored >= MAX_GROUPS) {
        return DEFAULT_GROUP_ID;
    }
    return stored;
}

export async function setActiveGroupId(workspaceFolder: WorkspaceFolder | undefined, id: number): Promise<void> {
    if (!Number.isFinite(id) || id < 0 || id >= MAX_GROUPS) {
        return;
    }
    await Container.context.workspaceState.update(storageKey(workspaceFolder), id);
    emitter.fire(id);
}
