/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { workspace, window, WorkspaceFolder, l10n, Uri } from "vscode";
import { Container } from "../core/container";
import { appendPath, createDirectoryUri, deleteFileUri, readFileUri, uriExists, writeFileUri } from "../utils/fs";
import { Controller } from "../core/controller";

const projectBookmarksInternalWrites = new Set<string>();

function canSaveBookmarksInProject(): boolean {
    let saveBookmarksInProject: boolean = workspace.getConfiguration("bookmarks").get("saveBookmarksInProject", false);
    
    // really use saveBookmarksInProject
    // 0. has at least a folder opened
    // 1. is a valid workspace/folder
    // 2. has only one workspaceFolder
    // let hasBookmarksFile: boolean = false;
    if (saveBookmarksInProject && !workspace.workspaceFolders) {
        saveBookmarksInProject = false;
    }

    return saveBookmarksInProject;
}

export function getProjectBookmarksUri(workspaceFolder: WorkspaceFolder): Uri {
    return appendPath(appendPath(workspaceFolder.uri, ".vscode"), "bookmarks.json");
}

export function isProjectBookmarksInternalWrite(uri: Uri): boolean {
    return projectBookmarksInternalWrites.has(uri.toString());
}

function markProjectBookmarksInternalWrite(uri: Uri): void {
    projectBookmarksInternalWrites.add(uri.toString());
}

function unmarkProjectBookmarksInternalWriteSoon(uri: Uri): void {
    setTimeout(() => {
        projectBookmarksInternalWrites.delete(uri.toString());
    }, 500);
}

export async function reloadBookmarks(controller: Controller): Promise<void> {
    if (!controller.workspaceFolder) {
        return;
    }

    const reloadedController = await loadBookmarks(controller.workspaceFolder);
    controller.files = reloadedController.files;
}

export async function loadBookmarks(workspaceFolder: WorkspaceFolder): Promise<Controller> {
    const saveBookmarksInProject: boolean = canSaveBookmarksInProject();

    const newController = new Controller(workspaceFolder);

    if (saveBookmarksInProject) {
        const bookmarksFileInProject = getProjectBookmarksUri(workspaceFolder);
        if (! await uriExists(bookmarksFileInProject)) {
            return newController;
        }
        try {
            const contents = await readFileUri(bookmarksFileInProject);
            newController.loadFrom(contents, true);
            return newController;
        } catch (error) {
            window.showErrorMessage(l10n.t("Error loading Bookmarks: ") + error.toString());
            return newController;
        }
    } else {
        const savedBookmarks = Container.context.workspaceState.get("bookmarks", "");
        if (savedBookmarks !== "") {
            newController.loadFrom(JSON.parse(savedBookmarks));
        }
        return newController;
    }        
}

export function saveBookmarks(controller: Controller): void {
    const saveBookmarksInProject: boolean = canSaveBookmarksInProject();
    
    if (saveBookmarksInProject) {
        const bookmarksFileInProject = getProjectBookmarksUri(controller.workspaceFolder);
        markProjectBookmarksInternalWrite(bookmarksFileInProject);

        void (async () => {
            try {
                // avoid empty bookmarks.json file
                if (!controller.hasAnyBookmark()) {
                    if (await uriExists(bookmarksFileInProject)) {
                        await deleteFileUri(bookmarksFileInProject);
                    }
                    return;
                }

                if (! await uriExists(appendPath(controller.workspaceFolder.uri, ".vscode"))) {
                    await createDirectoryUri(appendPath(controller.workspaceFolder.uri, ".vscode"));
                }
                await writeFileUri(bookmarksFileInProject, JSON.stringify(controller.zip(), null, "\t"));
            } finally {
                unmarkProjectBookmarksInternalWriteSoon(bookmarksFileInProject);
            }
        })();
    } else {
        Container.context.workspaceState.update("bookmarks", JSON.stringify(controller.zip()));
    }
}
