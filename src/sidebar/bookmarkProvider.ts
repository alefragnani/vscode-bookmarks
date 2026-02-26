/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import path = require("path");
import * as vscode from "vscode";
import { Controller } from "../core/controller";
import { parsePosition, Point } from "./parser";
import { codicons } from "vscode-ext-codicons";
import { listBookmarks } from "../core/operations";
import { Container } from "../core/container";
import { FileNode } from "./fileNode";
import { BookmarkNode, BookmarkPreview } from "./bookmarkNode";
import { WorkspaceNode } from "./workspaceNode";
import { BookmarkNodeKind } from "./nodes";
import { BadgeConfig } from "../core/constants";

export class BookmarkProvider implements vscode.TreeDataProvider<BookmarkNode | WorkspaceNode | FileNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<BookmarkNode | void> = new vscode.EventEmitter<BookmarkNode | void>();
    public readonly onDidChangeTreeData: vscode.Event<BookmarkNode | void> = this._onDidChangeTreeData.event;

    private tree: BookmarkNode[] = [];

    private collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

    constructor(private controllers: Controller[]) {

        if (vscode.workspace.getConfiguration("bookmarks.sideBar").get<boolean>("expanded", false)) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        }

        this.registerControllerListeners(controllers);
    }

    public updateControllers(controllers: Controller[]): void {
        this.controllers = controllers;
        this.registerControllerListeners(controllers);
        this.refresh();
    }

    private registerControllerListeners(controllers: Controller[]): void {

        for (const controller of controllers) {
            controller.onDidClearBookmarks(() => {
                this._onDidChangeTreeData.fire();
            });
        }

        for (const controller of controllers) {

            controller.onDidAddBookmark(bkm => {

                // no bookmark in this file
                if (this.tree.length === 0) {
                    this._onDidChangeTreeData.fire();
                    return;
                }

                // has bookmarks - find it
                for (const bn of this.tree) {
                    if (bn.bookmark === bkm.file) {

                        if (!bkm.label) {
                            bn.books.push({
                                file: bn.books[ 0 ].file,
                                line: bkm.line,
                                column: bkm.column,
                                preview: bkm.linePreview,
                                uri: bkm.uri
                            });
                        } else {
                            bn.books.push({
                                file: bn.books[ 0 ].file,
                                line: bkm.line,
                                column: bkm.column,
                                preview: "\u270E " + bkm.label,
                                uri: bkm.uri
                            });
                        }

                        bn.books.sort((n1, n2) => {
                            if (n1.line > n2.line) {
                                return 1;
                            }

                            if (n1.line < n2.line) {
                                return -1;
                            }

                            return 0;
                        });

                        this._onDidChangeTreeData.fire(bn);
                        return;
                    }
                }

                // not found - new file
                this._onDidChangeTreeData.fire();
            });
        }


        for (const controller of controllers) {

            controller.onDidRemoveBookmark(bkm => {

                // no bookmark in this file
                if (this.tree.length === 0) {
                    this._onDidChangeTreeData.fire();
                    return;
                }

                // has bookmarks - find it
                for (const bn of this.tree) {
                    if (bn.bookmark === bkm.bookmark) {

                        // last one - reset
                        if (bn.books.length === 1) {
                            this._onDidChangeTreeData.fire(null);
                            return;
                        }

                        // remove just that one
                        for (let index = 0; index < bn.books.length; index++) {
                            const element = bn.books[ index ];
                            if (element.line === bkm.line) {
                                bn.books.splice(index, 1);
                                this._onDidChangeTreeData.fire(bn);
                                return;
                            }
                        }
                    }
                }
            });
        }

        for (const controller of controllers) {

            controller.onDidUpdateBookmark(bkm => {

                // no bookmark in this file
                if (this.tree.length === 0) {
                    this._onDidChangeTreeData.fire();
                    return;
                }

                // has bookmarks - find it
                for (const bn of this.tree) {
                    if (bn.bookmark === bkm.file) {

                        bn.books[ bkm.index ].line = bkm.line;
                        bn.books[ bkm.index ].column = bkm.column ? bkm.column : bn.books[ bkm.index ].column;
                        if (bkm.linePreview) {
                            bn.books[ bkm.index ].preview = bkm.linePreview;
                        } else {
                            bn.books[ bkm.index ].preview = "\u270E " + bkm.label;
                        }

                        this._onDidChangeTreeData.fire(bn);
                        return;
                    }
                }

                // not found - new file
                this._onDidChangeTreeData.fire();
            });
        }
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    public getTreeItem(element: BookmarkNode): vscode.TreeItem {
        return element;
    }

    // very much based in `listFromAllFiles` command
    public getChildren(element?: FileNode | WorkspaceNode): Thenable<BookmarkNode[] | WorkspaceNode[] | FileNode[]> {

        // no bookmark
        // let totalBookmarkCount = 0;

        let someFileHasBookmark: boolean;
        for (const controller of this.controllers) {
            someFileHasBookmark = controller.hasAnyBookmark();
            if (someFileHasBookmark) { break; }
        }

        if (!someFileHasBookmark) {
            this.tree = [];
            return Promise.resolve([]);
        }

        // loop !!!
        return new Promise(resolve => {

            if (element) {

                if (element.kind === BookmarkNodeKind.NODE_WORKSPACE_FOLDER) {

                    const promisses = [];
                    const ne = <WorkspaceNode>element;
                    for (const file of ne.controller.files) {
                        const pp = listBookmarks(file, ne.controller.workspaceFolder);
                        promisses.push(pp);
                    }

                    Promise.all(promisses).then(
                        (values) => {

                            // raw list
                            const lll: FileNode[] = [];
                            for (const bb of ne.controller.files) {

                                // this bookmark has bookmarks?
                                if (bb.bookmarks.length > 0) {

                                    const books: BookmarkPreview[] = [];

                                    // search from `values`no
                                    for (const elm of values) {
                                        if (elm) {
                                            for (const elementInside of elm) {

                                                if (bb.path === elementInside.detail) {

                                                    const point: Point = parsePosition(elementInside.description);
                                                    books.push(
                                                        {
                                                            file: elementInside.detail,
                                                            line: point.line,
                                                            column: point.column,
                                                            preview: elementInside.label.replace(codicons.tag, "\u270E"),
                                                            uri: elementInside.uri
                                                        }
                                                    );
                                                }
                                            }
                                        }
                                    }

                                    const itemPath = path.basename(bb.path);
                                    const bn: FileNode = new FileNode(itemPath, removeRelativePathFromFile(bb.path), this.collapsibleState, BookmarkNodeKind.NODE_FILE, bb, books);
                                    lll.push(bn);
                                    // this.tree.push(bn);
                                }
                            }

                            resolve(lll);
                        }
                    );
                    return;
                }

                if (element.kind === BookmarkNodeKind.NODE_FILE) {
                    const ll: BookmarkNode[] = [];

                    const ne = <BookmarkNode>element;

                    const hidePosition = Container.context.globalState.get<boolean>("bookmarks.sidebar.hidePosition", false);

                    for (const bbb of ne.books) {
                        ll.push(new BookmarkNode(bbb.preview, !hidePosition ? `(Ln ${bbb.line}, Col ${bbb.column})` : undefined, vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK, null, [], {
                            command: "_bookmarks.jumpTo",
                            title: "",
                            arguments: [ bbb.file, bbb.line, bbb.column, bbb.uri ],
                        }));
                    }

                    resolve(ll);
                } else {
                    resolve([]);
                }
            } else { // ROOT

                //
                const viewAsList = Container.context.globalState.get<boolean>("viewAsList", false);

                // has more than one controller/worskpace and View As TREE, just loop through the controllers and returns its workspaces
                if (this.controllers.length > 1 && !viewAsList) {
                    const workspaces = [];
                    for (const controller of this.controllers) {
                        const wn: WorkspaceNode = new WorkspaceNode(controller.workspaceFolder.name, controller.workspaceFolder,
                            this.collapsibleState, BookmarkNodeKind.NODE_WORKSPACE_FOLDER, [], controller);
                        workspaces.push(wn);
                    }
                    resolve(workspaces);
                    return;
                }

                this.tree = [];
                const promisses = [];

                // get all files, from all controllers/workspaces
                for (const controller of this.controllers) {
                    for (const file of controller.files) {
                        const pp = listBookmarks(file, controller.workspaceFolder);
                        promisses.push(pp);
                    }
                }

                // all files, from all controllers/workspaces
                Promise.all(promisses).then(
                    (values) => {

                        // raw list
                        const lll: FileNode[] = [];
                        for (const controller of this.controllers) {
                            for (const bb of controller.files) {

                                // this bookmark has bookmarks?
                                if (bb.bookmarks.length > 0) {

                                    const books: BookmarkPreview[] = [];

                                    // search from `values`no
                                    for (const elm of values) {
                                        if (elm) {
                                            for (const elementInside of elm) {

                                                if (bb.path === elementInside.detail) {

                                                    const point: Point = parsePosition(elementInside.description);
                                                    books.push(
                                                        {
                                                            file: elementInside.detail,
                                                            line: point.line,
                                                            column: point.column,
                                                            preview: elementInside.label.replace(codicons.tag, "\u270E"),
                                                            uri: elementInside.uri
                                                        }
                                                    );
                                                }
                                            }
                                        }
                                    }

                                    const itemPath = path.basename(bb.path);
                                    const bn: FileNode = new FileNode(itemPath, removeRelativePathFromFile(bb.path), this.collapsibleState, BookmarkNodeKind.NODE_FILE, bb, books);
                                    lll.push(bn);
                                    // this.tree.push(bn);
                                }
                            }
                        }

                        // choose the view
                        if (viewAsList) {
                            const hidePosition = Container.context.globalState.get<boolean>("bookmarks.sidebar.hidePosition", false);
                            const bookmarkNodes: BookmarkNode[] = [];
                            lll.forEach(FileNode => {
                                for (const bbb of FileNode.books) {
                                    bookmarkNodes.push(new BookmarkNode(bbb.preview, !hidePosition ? `(Ln ${bbb.line}, Col ${bbb.column})` : undefined, vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK, null, [], {
                                        command: "_bookmarks.jumpTo",
                                        title: "",
                                        arguments: [ bbb.file, bbb.line, bbb.column, bbb.uri ],
                                    }));
                                }
                            });
                            resolve(bookmarkNodes);
                        }

                        // viewAsTree returns FileNode[]
                        resolve(lll);
                    }
                );
            }
        });
    }

}

function removeRelativePathFromFile(aPath: string): string {
    const filename = path.basename(aPath);
    const dirname = aPath.substring(0, aPath.length - filename.length - 1);
    return dirname;
}

export class BookmarksExplorer {

    private bookmarksExplorer: vscode.TreeView<BookmarkNode | WorkspaceNode | FileNode>;
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