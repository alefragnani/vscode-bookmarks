/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { workspace, window, WorkspaceFolder, l10n } from "vscode";
import { Container } from "../core/container";
import { appendPath, createDirectoryUri, deleteFileUri, readFileUri, uriExists, writeFileUri } from "../utils/fs";
import { Controller } from "../core/controller";

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

export async function loadBookmarks(workspaceFolder: WorkspaceFolder): Promise<Controller> {
    const saveBookmarksInProject: boolean = canSaveBookmarksInProject();

    const newController = new Controller(workspaceFolder);

    if (saveBookmarksInProject) {
        const bookmarksFileInProject = appendPath(appendPath(workspaceFolder.uri, ".vscode"), "bookmarks.json");
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
        const bookmarksFileInProject = appendPath(appendPath(controller.workspaceFolder.uri, ".vscode"), "bookmarks.json");

        // avoid empty bookmarks.json file
        if (!controller.hasAnyBookmark()) {
            if (uriExists(bookmarksFileInProject)) {
                deleteFileUri(bookmarksFileInProject);
            }
            return;
        }

        if (!uriExists(appendPath(controller.workspaceFolder.uri, ".vscode"))) {
            createDirectoryUri(appendPath(controller.workspaceFolder.uri, ".vscode"));
        }
        writeFileUri(bookmarksFileInProject, JSON.stringify(controller.zip(), null, "\t"));   
    } else {
        Container.context.workspaceState.update("bookmarks", JSON.stringify(controller.zip()));
    }
}