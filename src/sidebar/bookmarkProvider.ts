/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import path = require("path");
import * as vscode from "vscode";
import { Controller } from "../core/controller";
import { codicons } from "vscode-ext-codicons";
import { Container } from "../core/container";
import { FileNode } from "./fileNode";
import { BookmarkNode, BookmarkPreview } from "./bookmarkNode";
import { WorkspaceNode } from "./workspaceNode";
import { GroupNode } from "./groupNode";
import { BookmarkNodeKind } from "./nodes";
import { BadgeConfig, DEFAULT_GROUP_ID } from "../core/constants";
import { Bookmark } from "../core/bookmark";
import { File } from "../core/file";
import { getGroups } from "../core/groups";
import { getActiveGroupId, onDidChangeActiveGroup } from "../core/groupState";
import { getFileUri } from "../utils/fs";

type SidebarNode = BookmarkNode | WorkspaceNode | FileNode | GroupNode;

export class BookmarkProvider implements vscode.TreeDataProvider<SidebarNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<SidebarNode | void> = new vscode.EventEmitter<SidebarNode | void>();
    public readonly onDidChangeTreeData: vscode.Event<SidebarNode | void> = this._onDidChangeTreeData.event;

    private collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    private controllerListeners: vscode.Disposable[] = [];
    private activeGroupListener: vscode.Disposable;

    constructor(private controllers: Controller[]) {
        if (vscode.workspace.getConfiguration("bookmarks.sideBar").get<boolean>("expanded", false)) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        }

        this.registerControllerListeners(controllers);

        this.activeGroupListener = onDidChangeActiveGroup(() => {
            this._onDidChangeTreeData.fire();
        });
    }

    public updateControllers(controllers: Controller[]): void {
        this.controllers = controllers;
        this.registerControllerListeners(controllers);
        this.refresh();
    }

    private registerControllerListeners(controllers: Controller[]): void {
        for (const d of this.controllerListeners) {
            d.dispose();
        }
        this.controllerListeners = [];

        for (const controller of controllers) {
            this.controllerListeners.push(
                controller.onDidClearBookmarks(() => this._onDidChangeTreeData.fire())
            );
            this.controllerListeners.push(
                controller.onDidAddBookmark(() => this._onDidChangeTreeData.fire())
            );
            this.controllerListeners.push(
                controller.onDidRemoveBookmark(() => this._onDidChangeTreeData.fire())
            );
            this.controllerListeners.push(
                controller.onDidUpdateBookmark(() => this._onDidChangeTreeData.fire())
            );
        }
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    public dispose(): void {
        for (const d of this.controllerListeners) {
            d.dispose();
        }
        this.activeGroupListener?.dispose();
    }

    public getTreeItem(element: SidebarNode): vscode.TreeItem {
        return element;
    }

    public getChildren(element?: SidebarNode): Thenable<SidebarNode[]> {
        let anyHasBookmark = false;
        for (const controller of this.controllers) {
            if (controller.hasAnyBookmark()) {
                anyHasBookmark = true;
                break;
            }
        }

        if (!anyHasBookmark) {
            return Promise.resolve([]);
        }

        const viewAsList = Container.context.globalState.get<boolean>("viewAsList", false);
        const hidePosition = Container.context.globalState.get<boolean>("bookmarks.sidebar.hidePosition", false);
        const hideEmpty = vscode.workspace.getConfiguration("bookmarks.groups").get<boolean>("hideEmpty", false);

        if (!element) {
            // ROOT: multi-root tree mode → WorkspaceNode[]; otherwise GroupNode[]
            if (this.controllers.length > 1 && !viewAsList) {
                const workspaces: WorkspaceNode[] = [];
                for (const controller of this.controllers) {
                    const wn = new WorkspaceNode(
                        controller.workspaceFolder.name,
                        controller.workspaceFolder,
                        this.collapsibleState,
                        BookmarkNodeKind.NODE_WORKSPACE_FOLDER,
                        [],
                        controller
                    );
                    workspaces.push(wn);
                }
                return Promise.resolve(workspaces);
            }
            return Promise.resolve(this.buildGroupNodes(undefined, hideEmpty));
        }

        if (element instanceof WorkspaceNode) {
            return Promise.resolve(this.buildGroupNodes(element.controller, hideEmpty));
        }

        if (element instanceof GroupNode) {
            return Promise.resolve(this.buildGroupChildren(element, viewAsList, hidePosition));
        }

        if (element instanceof FileNode) {
            return Promise.resolve(this.buildBookmarkNodes(element.books ?? [], hidePosition));
        }

        return Promise.resolve([]);
    }

    private buildGroupNodes(scopedController: Controller | undefined, hideEmpty: boolean): GroupNode[] {
        const controllers = scopedController ? [scopedController] : this.controllers;
        const activeGroupId = getActiveGroupId(scopedController?.workspaceFolder ?? this.controllers[0]?.workspaceFolder);
        const groups = getGroups();
        const nodes: GroupNode[] = [];
        for (const group of groups) {
            const count = countBookmarksInGroup(controllers, group.id);
            if (hideEmpty && count === 0) {
                continue;
            }
            const collapsibleState = count === 0
                ? vscode.TreeItemCollapsibleState.None
                : this.collapsibleState;
            nodes.push(new GroupNode(group, controllers, count, group.id === activeGroupId, collapsibleState));
        }
        return nodes;
    }

    private buildGroupChildren(groupNode: GroupNode, viewAsList: boolean, hidePosition: boolean): SidebarNode[] {
        const fileNodes: FileNode[] = [];
        for (const controller of groupNode.controllers) {
            for (const file of controller.files) {
                const matching = file.bookmarks
                    .filter(bkm => (bkm.groupId ?? DEFAULT_GROUP_ID) === groupNode.group.id);
                if (matching.length === 0) {
                    continue;
                }
                const previews = matching.map(bkm => bookmarkToPreview(file, bkm, controller));
                const fileNode = new FileNode(
                    path.basename(file.path),
                    removeRelativePathFromFile(file.path),
                    this.collapsibleState,
                    BookmarkNodeKind.NODE_FILE,
                    file,
                    previews
                );
                fileNodes.push(fileNode);
            }
        }

        if (viewAsList) {
            const flat: BookmarkNode[] = [];
            for (const fn of fileNodes) {
                flat.push(...this.buildBookmarkNodes(fn.books ?? [], hidePosition));
            }
            return flat;
        }

        return fileNodes;
    }

    private buildBookmarkNodes(books: BookmarkPreview[], hidePosition: boolean): BookmarkNode[] {
        return books.map(bbb => new BookmarkNode(
            bbb.preview,
            !hidePosition ? `(Ln ${bbb.line}, Col ${bbb.column})` : undefined,
            vscode.TreeItemCollapsibleState.None,
            BookmarkNodeKind.NODE_BOOKMARK,
            null,
            [],
            {
                command: "_bookmarks.jumpTo",
                title: "",
                arguments: [bbb.file, bbb.line, bbb.column, bbb.uri]
            },
            bbb.groupId
        ));
    }
}

function countBookmarksInGroup(controllers: Controller[], groupId: number): number {
    let total = 0;
    for (const controller of controllers) {
        for (const file of controller.files) {
            for (const bkm of file.bookmarks) {
                if ((bkm.groupId ?? DEFAULT_GROUP_ID) === groupId) {
                    total++;
                }
            }
        }
    }
    return total;
}

function bookmarkToPreview(file: File, bkm: Bookmark, controller: Controller): BookmarkPreview {
    const uri = getFileUri(file, controller.workspaceFolder);
    const preview = bkm.label && bkm.label.length > 0
        ? `✎ ${bkm.label}`
        : `${codicons.bookmark ?? ""}`.trim() || file.path;
    return {
        file: file.path,
        line: bkm.line + 1,
        column: bkm.column + 1,
        preview,
        uri,
        groupId: bkm.groupId ?? DEFAULT_GROUP_ID
    };
}

function removeRelativePathFromFile(aPath: string): string {
    const filename = path.basename(aPath);
    const dirname = aPath.substring(0, aPath.length - filename.length - 1);
    return dirname;
}

export class BookmarksExplorer {

    private bookmarksExplorer: vscode.TreeView<SidebarNode>;
    private treeDataProvider: BookmarkProvider;
    private controllers: Controller[];
    private controllerListenerDisposables: vscode.Disposable[] = [];

    constructor(controllers: Controller[]) {
        this.controllers = controllers;
        this.treeDataProvider = new BookmarkProvider(controllers);
        this.bookmarksExplorer = vscode.window.createTreeView("bookmarksExplorer", {
            treeDataProvider: this.treeDataProvider,
            showCollapseAll: true
        });

        this.registerControllerListeners(controllers);
    }

    private registerControllerListeners(controllers: Controller[]): void {
        for (const controller of controllers) {
            this.controllerListenerDisposables.push(
                controller.onDidClearBookmarks(() => {
                    this.updateBadge();
                })
            );
            this.controllerListenerDisposables.push(
                controller.onDidAddBookmark(() => {
                    this.updateBadge();
                })
            );
            this.controllerListenerDisposables.push(
                controller.onDidRemoveBookmark(() => {
                    this.updateBadge();
                })
            );
        }
    }

    getProvider() {
        return this.treeDataProvider;
    }

    updateBadge() {
        const config = vscode.workspace.getConfiguration("bookmarks.sideBar").get<string>("countBadge", "all");
        if (config === BadgeConfig.Off) {
            this.bookmarksExplorer.badge = { value: 0, tooltip: "" };
            return;
        }

        if (config === BadgeConfig.All) {
            this.updateBadgeAllFiles();
        } else {
            this.updateBadgePerFile();
        }
    }

    private updateBadgeAllFiles() {
        let total = 0;
        this.controllers.forEach(controller =>
            total = total + controller.countBookmarks()
        );

        const badgeTooltip = total === 0
            ? ""
            : total === 1
                ? "1 bookmark"
                : `${total} bookmarks`;

        this.bookmarksExplorer.badge = { value: total, tooltip: badgeTooltip };
    }

    private updateBadgePerFile() {
        let total = 0;
        this.controllers.forEach(controller =>
            total = total + controller.countFilesWithBookmarks()
        );

        const badgeTooltip = total === 0
            ? ""
            : total === 1
                ? vscode.l10n.t("1 file with bookmarks")
                : `${total} ` + vscode.l10n.t("files with bookmarks");

        this.bookmarksExplorer.badge = { value: total, tooltip: badgeTooltip };

    }

    updateControllers(controllers: Controller[]): void {
        this.controllers = controllers;
        this.treeDataProvider.updateControllers(controllers);

        // Dispose of old listeners to prevent memory leaks
        this.controllerListenerDisposables.forEach(disposable => disposable.dispose());
        this.controllerListenerDisposables = [];

        // Register new listeners
        this.registerControllerListeners(controllers);

        this.updateBadge();
    }
}
