"use strict";

import * as vscode from "vscode";
import fs = require("fs");
import {Bookmark, JUMP_DIRECTION, JUMP_FORWARD, NO_MORE_BOOKMARKS} from "./Bookmark";

interface BookmarkAdded {
    bookmark: Bookmark;
    line: number;
    preview: string;
}

interface BookmarkRemoved {
    bookmark: Bookmark;
    line: number;
}

export class Bookmarks {

    private onDidClearBookmarkEmitter = new vscode.EventEmitter<Bookmark>();
    get onDidClearBookmark(): vscode.Event<Bookmark> { return this.onDidClearBookmarkEmitter.event; }

    private onDidClearAllBookmarksEmitter = new vscode.EventEmitter<Bookmark>();
    get onDidClearAllBookmarks(): vscode.Event<Bookmark> { return this.onDidClearAllBookmarksEmitter.event; }

    private onDidAddBookmarkEmitter = new vscode.EventEmitter<BookmarkAdded>();
    get onDidAddBookmark(): vscode.Event<BookmarkAdded> { return this.onDidAddBookmarkEmitter.event; }

    private onDidRemoveBookmarkEmitter = new vscode.EventEmitter<BookmarkRemoved>();
    get onDidRemoveBookmark(): vscode.Event<BookmarkRemoved> { return this.onDidRemoveBookmarkEmitter.event; }

    public static normalize(uri: string): string {
            // a simple workaround for what appears to be a vscode.Uri bug
            // (inconsistent fsPath values for the same document, ex. ///foo/x.cpp and /foo/x.cpp)
            return uri.replace("///", "/");
        }
        
        public bookmarks: Bookmark[];
        public activeBookmark: Bookmark = undefined;

        constructor(jsonObject) {
            this.bookmarks = [];
        }

        public dispose() {
            this.zip();
        }
        
        public loadFrom(jsonObject, relativePath?: boolean) {
            if (jsonObject === "") {
                return;
            }
            
            let jsonBookmarks = jsonObject.bookmarks;
            for (let idx = 0; idx < jsonBookmarks.length; idx++) {
              let jsonBookmark = jsonBookmarks[idx];
              
              // each bookmark (line)
              this.add(jsonBookmark.fsPath);
              // for (let index = 0; index < jsonBookmark.bookmarks.length; index++) {
              for (let element of jsonBookmark.bookmarks) {
                  this.bookmarks[idx].bookmarks.push(element); // jsonBookmark.bookmarks[index]);
              }
            }

            if (relativePath) {
                for (let element of this.bookmarks) {
                    element.fsPath = element.fsPath.replace("$ROOTPATH$", vscode.workspace.rootPath);
                }
            }
        }

        public fromUri(uri: string) {
            uri = Bookmarks.normalize(uri);
            // for (let index = 0; index < this.bookmarks.length; index++) {
            for (let element of this.bookmarks) {
                // let element = this.bookmarks[index];

                if (element.fsPath === uri) {
                    return element;
                }
            }
        }

        public add(uri: string) {
            // console.log(`Adding bookmark/file: ${uri}`);
            uri = Bookmarks.normalize(uri);
            
            let existing: Bookmark = this.fromUri(uri);
            if (typeof existing === "undefined") {
                let bookmark = new Bookmark(uri);
                this.bookmarks.push(bookmark);
            }
        }

        public nextDocumentWithBookmarks(active: Bookmark, direction: JUMP_DIRECTION = JUMP_FORWARD) {

            let currentBookmark: Bookmark = active;
            let currentBookmarkId: number;
            for (let index = 0; index < this.bookmarks.length; index++) {
                let element = this.bookmarks[index];
                if (element === active) {
                    currentBookmarkId = index;
                }
            }

            return new Promise((resolve, reject) => {

                if (direction === JUMP_FORWARD) {
                  currentBookmarkId++;
                  if (currentBookmarkId === this.bookmarks.length) {
                      currentBookmarkId = 0;
                  }
                } else {
                  currentBookmarkId--;
                  if (currentBookmarkId === -1) {
                      currentBookmarkId = this.bookmarks.length - 1;
                  }
                }
                
                currentBookmark = this.bookmarks[currentBookmarkId];
                
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
                    if (fs.existsSync(currentBookmark.fsPath)) {
                        resolve(currentBookmark.fsPath);
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

        public nextBookmark(active: Bookmark, currentLine: number) {

            let currentBookmark: Bookmark = active;
            let currentBookmarkId: number;
            for (let index = 0; index < this.bookmarks.length; index++) {
                let element = this.bookmarks[index];
                if (element === active) {
                    currentBookmarkId = index;
                }
            }

            return new Promise((resolve, reject) => {

                currentBookmark.nextBookmark(currentLine)
                    .then((newLine) => {
                        resolve(newLine);
                        return;
                    })
                    .catch((error) => {
                        // next document                  
                        currentBookmarkId++;
                        if (currentBookmarkId === this.bookmarks.length) {
                            currentBookmarkId = 0;
                        }
                        currentBookmark = this.bookmarks[currentBookmarkId];

                    });

            });
        }
        
        public zip(relativePath?: boolean): Bookmarks {
            function isNotEmpty(book: Bookmark): boolean {
                return book.bookmarks.length > 0;
            }
            
            let newBookmarks: Bookmarks = new Bookmarks("");
            //  newBookmarks.bookmarks = this.bookmarks.filter(isNotEmpty);
            newBookmarks.bookmarks = JSON.parse(JSON.stringify(this.bookmarks)).filter(isNotEmpty);

            if (!relativePath) {
                return newBookmarks;
            }

            for (let element of newBookmarks.bookmarks) {
                element.fsPath = element.fsPath.replace(vscode.workspace.rootPath, "$ROOTPATH$");
            }
            return newBookmarks;
        }

        public clear(book?: Bookmark): void {
            let b: Bookmark = book ? book : this.activeBookmark;
            b.clear();
            this.onDidClearBookmarkEmitter.fire(b);
        }

        public clearAll(): void {
            for (let element of this.bookmarks) {
                element.clear();
            }     
            this.onDidClearAllBookmarksEmitter.fire();       
        }

        public addBookmark(aline: number): void {
            this.activeBookmark.bookmarks.push(aline);
            this.onDidAddBookmarkEmitter.fire({
                bookmark: this.activeBookmark, 
                line: aline + 1,
                preview: vscode.window.activeTextEditor.document.lineAt(aline).text
            });
        }

        public removeBookmark(index, aline: number, book?: Bookmark): void {
            let b: Bookmark = book ? book : this.activeBookmark;
            b.bookmarks.splice(index, 1);
            this.onDidRemoveBookmarkEmitter.fire({
                bookmark: b, 
                line: aline + 1
            });
        }
    }
