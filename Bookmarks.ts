"use strict";

import fs = require("fs");
import {Bookmark, JUMP_DIRECTION, JUMP_FORWARD, NO_MORE_BOOKMARKS} from "./Bookmark";

export class Bookmarks {

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
        
        // public getActiveBookmark(): Bookmark {
        //     return this.activeBookmark;
        // }
        
        // public setActiveBookmark(book: Bookmark) {
        //     this.activeBookmark = book;
        // }

        public loadFrom(jsonObject) {
            if (jsonObject === "") {
                return;
            }
            
            let jsonBookmarks = jsonObject.bookmarks;
            for (let idx = 0; idx < jsonBookmarks.length; idx++) {
              let jsonBookmark = jsonBookmarks[idx];
              
              // each bookmark (line)
              this.add(jsonBookmark.fsPath);
              for (let index = 0; index < jsonBookmark.bookmarks.length; index++) {
                  this.bookmarks[idx].bookmarks.push(jsonBookmark.bookmarks[index]);
              }
            }
        }

        public fromUri(uri: string) {
            uri = Bookmarks.normalize(uri);
            for (let index = 0; index < this.bookmarks.length; index++) {
                let element = this.bookmarks[index];

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
        
        public zip() {
            function isNotEmpty(book: Bookmark): boolean {
                return book.bookmarks.length > 0;
            }
            
            let newBookmarks: Bookmark[] = this.bookmarks.filter(isNotEmpty);
            console.log("before");
            console.log("newBookmarks.length" + newBookmarks.length);
            console.log("this.bookmarks" + this.bookmarks.length);
            this.bookmarks = newBookmarks;
            console.log("after");
            console.log("this.bookmarks" + this.bookmarks.length);
        }
    }
