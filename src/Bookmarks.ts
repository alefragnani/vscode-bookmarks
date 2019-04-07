"use strict";

import * as vscode from "vscode";
import fs = require("fs");
import { BookmarkedFile, JUMP_DIRECTION, JUMP_FORWARD, NO_MORE_BOOKMARKS, NO_BOOKMARKS_BEFORE, NO_BOOKMARKS_AFTER, BookmarkItem } from "./Bookmark";
import { Storage } from "./Storage";
import { Uri } from "vscode";

interface BookmarkAdded {
    bookmarkedFile: BookmarkedFile;
    line: number;
    column: number;
    linePreview?: string;
    label?: string;
}

interface BookmarkRemoved {
    bookmark: BookmarkedFile;
    line: number;
}

interface BookmarkUpdated {
    bookmarkedFile: BookmarkedFile;
    index: number;
    line: number;
    linePreview?: string;
    label?: string
}

export class BookmarksController {

    private onDidClearBookmarkEmitter = new vscode.EventEmitter<BookmarkedFile>();
    get onDidClearBookmark(): vscode.Event<BookmarkedFile> { return this.onDidClearBookmarkEmitter.event; }

    private onDidClearAllBookmarksEmitter = new vscode.EventEmitter<BookmarkedFile>();
    get onDidClearAllBookmarks(): vscode.Event<BookmarkedFile> { return this.onDidClearAllBookmarksEmitter.event; }

    private onDidAddBookmarkEmitter = new vscode.EventEmitter<BookmarkAdded>();
    get onDidAddBookmark(): vscode.Event<BookmarkAdded> { return this.onDidAddBookmarkEmitter.event; }

    private onDidRemoveBookmarkEmitter = new vscode.EventEmitter<BookmarkRemoved>();
    get onDidRemoveBookmark(): vscode.Event<BookmarkRemoved> { return this.onDidRemoveBookmarkEmitter.event; }

    private onDidUpdateBookmarkEmitter = new vscode.EventEmitter<BookmarkUpdated>();
    get onDidUpdateBookmark(): vscode.Event<BookmarkUpdated> { return this.onDidUpdateBookmarkEmitter.event; }

    public static normalize(uri: string): string {
            // a simple workaround for what appears to be a vscode.Uri bug
            // (inconsistent fsPath values for the same document, ex. ///foo/x.cpp and /foo/x.cpp)
            return uri.replace("///", "/");
        }
        
        public storage: Storage.BookmarksStorage;
        // public bookmarks: BookmarkedFile[];
        public activeBookmark: BookmarkedFile = undefined;

        constructor(jsonObject) {
            this.storage = new Storage.BookmarksStorage();
            // this.bookmarks = [];
        }

        public dispose() {
            this.zip();
        }
        
        public fromUri(uri: Uri) {
            const path = BookmarksController.normalize(uri.fsPath);
            for (let element of this.storage.fileList) {
                if (element.path === path && 
                    (( element.scheme === uri.scheme && element.authority === uri.authority)
                    ||(!element.scheme && ! element.authority ))) {
                    return element;
                }
            }
        }

        public add(uri: vscode.Uri) {
            
            
            let existing: BookmarkedFile = this.fromUri(uri);
            if (typeof existing === "undefined") {
                let bookmark = new BookmarkedFile(uri);
                this.storage.fileList.push(bookmark);
            }
        }

        public nextDocumentWithBookmarks(active: BookmarkedFile, direction: JUMP_DIRECTION = JUMP_FORWARD) {

            let currentBookmark: BookmarkedFile = active;
            let currentBookmarkId: number;
            for (let index = 0; index < this.storage.fileList.length; index++) {
                let element = this.storage.fileList[index];
                if (element === active) {
                    currentBookmarkId = index;
                }
            }

            return new Promise((resolve, reject) => {

                const wrapNavigation: boolean = vscode.workspace.getConfiguration("bookmarks").get("wrapNavigation", true);

                let wrapStatus: number;

                if (direction === JUMP_FORWARD) {
                  currentBookmarkId++;
                  if (currentBookmarkId === this.storage.fileList.length) {
                      currentBookmarkId = wrapNavigation ? 0 : currentBookmarkId - 1;
                      wrapStatus = wrapNavigation ? null : NO_BOOKMARKS_AFTER;
                  }
                } else {
                  currentBookmarkId--;
                  if (currentBookmarkId === -1) {
                      currentBookmarkId = wrapNavigation ? this.storage.fileList.length - 1 : currentBookmarkId + 1;
                      wrapStatus = wrapNavigation ? null : NO_BOOKMARKS_BEFORE;
                  }
                }

                if (wrapStatus && !wrapNavigation) {
                    reject(wrapStatus);
                    return;
                }
                
                currentBookmark = this.storage.fileList[currentBookmarkId];
                
                if (currentBookmark.bookmarks.length === 0) {                    
                    if (currentBookmark === this.activeBookmark) {
                        resolve(NO_MORE_BOOKMARKS);
                        return;
                    } else {
                        this.nextDocumentWithBookmarks(currentBookmark, direction)
                            .then((nextDocument) => {
                                resolve(nextDocument);
                                return;
                            })
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    }                   
                } else {
                    if (currentBookmark.scheme !== "file" || fs.existsSync(currentBookmark.path)) {
                        resolve(currentBookmark);
                        return;
                    } else {
                        this.nextDocumentWithBookmarks(currentBookmark, direction)
                            .then((nextDocument) => {
                                resolve(nextDocument);
                                return;
                            })
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    }
                }

            });

        }

        public clear(book?: BookmarkedFile): void {
            let b: BookmarkedFile = book ? book : this.activeBookmark;
            b.clear();
            this.onDidClearBookmarkEmitter.fire(b);
        }

        public clearAll(): void {
            for (let element of this.storage.fileList) {
                element.clear();
            }     
            this.onDidClearAllBookmarksEmitter.fire();       
        }

        public addBookmark(position: vscode.Position, label?: string): void {

            if (!label) {
                this.activeBookmark.bookmarks.push(new BookmarkItem(position.line, position.character));
                this.onDidAddBookmarkEmitter.fire({
                    bookmarkedFile: this.activeBookmark, 
                    line: position.line + 1,
                    column: position.character + 1,
                    linePreview: vscode.window.activeTextEditor.document.lineAt(position.line).text.trim()
                });
            } else {
                this.activeBookmark.bookmarks.push(new BookmarkItem(position.line, position.character, label));
                this.onDidAddBookmarkEmitter.fire({
                    bookmarkedFile: this.activeBookmark, 
                    line: position.line + 1,
                    column: position.character + 1,
                    label: label
                });
            }
        }

        public removeBookmark(index: number, aline: number, book?: BookmarkedFile): void {
            let b: BookmarkedFile = book ? book : this.activeBookmark;
            b.bookmarks.splice(index, 1);
            this.onDidRemoveBookmarkEmitter.fire({
                bookmark: b, 
                line: aline + 1
            });
        }

        public updateBookmark(index: number, oldLine: number, newLine: number, book?: BookmarkedFile): void {
            let b: BookmarkedFile = book ? book : this.activeBookmark;
            b.bookmarks[index].line = newLine;
            if (!b.bookmarks[index].label) {
                this.onDidUpdateBookmarkEmitter.fire({
                    bookmarkedFile: b,
                    index: index,
                    line: newLine + 1,
                    linePreview: vscode.window.activeTextEditor.document.lineAt(newLine).text
                });    
            } else {
                this.onDidUpdateBookmarkEmitter.fire({
                    bookmarkedFile: b,
                    index: index,
                    line: newLine + 1,
                    label: b.bookmarks[index].label
                });    
            }
        }

        public hasAnyBookmark(): boolean {
            let totalBookmarkCount: number = 0;
            for (let element of this.storage.fileList) {
                totalBookmarkCount = totalBookmarkCount + element.bookmarks.length; 
            }
            return totalBookmarkCount > 0;
        }


        ///
        public loadFrom(jsonObject, relativePath?: boolean) {
            if (jsonObject === "") {
                return;
            }

            this.storage.load(jsonObject, relativePath, vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined);
            
        }

        updateRelativePath = (path: string): string => {
            let wsPath: vscode.WorkspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(path));
            if (wsPath) {
                path = path.replace(wsPath.uri.fsPath, "$ROOTPATH$"); 
            }
            return path;
        }
        
        public zip(relativePath?: boolean): BookmarksController {
            return this.storage.save(relativePath, this.updateRelativePath);
        }
    }
