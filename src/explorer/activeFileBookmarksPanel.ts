/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Controller } from "../core/controller";
import { File } from "../core/file";
import { BookmarkNode } from "../sidebar/bookmarkNode";
import { BookmarkNodeKind } from "../sidebar/nodes";

export class ActiveFileBookmarksProvider implements vscode.TreeDataProvider<BookmarkNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<BookmarkNode | void> =
        new vscode.EventEmitter<BookmarkNode | void>();
    public readonly onDidChangeTreeData: vscode.Event<BookmarkNode | void> = this._onDidChangeTreeData.event;

    constructor(private readonly getActiveFile: () => File) { }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    public getTreeItem(element: BookmarkNode): vscode.TreeItem {
        return element;
    }

    // flat list of the bookmarks of the active/focused file, similar to the Outline view
    public getChildren(element?: BookmarkNode): Thenable<BookmarkNode[]> {

        // this view has no nested levels
        if (element) {
            return Promise.resolve([]);
        }

        const activeFile = this.getActiveFile();
        const editor = vscode.window.activeTextEditor;

        // no active file, no editor, or no bookmark in the active file
        if (!activeFile || !editor || activeFile.bookmarks.length === 0) {
            return Promise.resolve([]);
        }

        const nodes: BookmarkNode[] = [];
        for (const book of activeFile.bookmarks) {

            const line = book.line + 1;
            const column = book.column + 1;
            const lineText = editor.document.lineAt(book.line).text.trim();
            const preview = !book.label ? lineText : `\u270E ${book.label}`;

            nodes.push(new BookmarkNode(
                preview,
                `(Ln ${line}, Col ${column})`,
                vscode.TreeItemCollapsibleState.None,
                BookmarkNodeKind.NODE_BOOKMARK,
                activeFile,
                [],
                {
                    command: "_bookmarks.jumpTo",
                    title: "",
                    arguments: [ activeFile.path, line, column, editor.document.uri ],
                }
            ));
        }

        return Promise.resolve(nodes);
    }
}

export class ActiveFileBookmarksPanel implements vscode.Disposable {

    private readonly treeDataProvider: ActiveFileBookmarksProvider;
    private readonly treeView: vscode.TreeView<BookmarkNode>;
    private controllerListenerDisposables: vscode.Disposable[] = [];

    constructor(controllers: Controller[], getActiveFile: () => File) {
        this.treeDataProvider = new ActiveFileBookmarksProvider(getActiveFile);
        this.treeView = vscode.window.createTreeView("bookmarksExplorerPanel", {
            treeDataProvider: this.treeDataProvider,
            showCollapseAll: false,
        });

        this.registerControllerListeners(controllers);
    }

    public getProvider(): ActiveFileBookmarksProvider {
        return this.treeDataProvider;
    }

    public refresh(): void {
        this.treeDataProvider.refresh();
    }

    public updateControllers(controllers: Controller[]): void {
        this.controllerListenerDisposables.forEach(disposable => disposable.dispose());
        this.controllerListenerDisposables = [];
        this.registerControllerListeners(controllers);
        this.refresh();
    }

    public dispose(): void {
        this.controllerListenerDisposables.forEach(disposable => disposable.dispose());
        this.controllerListenerDisposables = [];
        this.treeView.dispose();
    }

    private registerControllerListeners(controllers: Controller[]): void {
        for (const controller of controllers) {
            this.controllerListenerDisposables.push(controller.onDidClearBookmarks(() => this.refresh()));
            this.controllerListenerDisposables.push(controller.onDidAddBookmark(() => this.refresh()));
            this.controllerListenerDisposables.push(controller.onDidRemoveBookmark(() => this.refresh()));
            this.controllerListenerDisposables.push(controller.onDidUpdateBookmark(() => this.refresh()));
        }
    }
}
