/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import os = require("os");
import path = require("path");
import * as vscode from "vscode";
import { Uri, WorkspaceFolder } from "vscode";
import { Directions, NO_BOOKMARKS_AFTER, NO_BOOKMARKS_BEFORE, NO_MORE_BOOKMARKS, UNTITLED_SCHEME } from "./constants";
import { createFile, File } from "./file";
import { getFileUri, getRelativePath, uriExists } from "../utils/fs";
import { clear, getLinePreview, indexOfBookmark } from "./operations";
import { updateLinesWithBookmarkContext } from "../gutter/editorLineNumberContext";

interface BookmarkAdded {
    file: File;
    line: number;
    column: number;
    linePreview?: string;
    label?: string;
    uri: Uri;
}

interface BookmarkRemoved {
    bookmark: File;
    line: number;
}

interface BookmarkUpdated {
    file: File;
    index: number;
    line: number;
    column?: number;
    linePreview?: string;
    label?: string
}

enum ToggleMode {
    allLinesAtOnce = "allLinesAtOnce",
    eachLineIndependently = "eachLineIndependently",
}

enum ToggleState {
    on = "on",
    off = "off",
    editLabel = "edit"
}

export enum BookmarkClearEventReason {
    singleFile, allFiles
}

export interface BookmarkClearEvent {
    file?: File | undefined;
    reason: BookmarkClearEventReason;
}

export class Controller {
    public files: File[];
    public workspaceFolder: WorkspaceFolder | undefined;

    private onDidClearBookmarksEmitter = new vscode.EventEmitter<BookmarkClearEvent>();
    get onDidClearBookmarks(): vscode.Event<BookmarkClearEvent> {
        return this.onDidClearBookmarksEmitter.event;
    }

    private onDidAddBookmarkEmitter = new vscode.EventEmitter<BookmarkAdded>();
    get onDidAddBookmark(): vscode.Event<BookmarkAdded> { return this.onDidAddBookmarkEmitter.event; }

    private onDidRemoveBookmarkEmitter = new vscode.EventEmitter<BookmarkRemoved>();
    get onDidRemoveBookmark(): vscode.Event<BookmarkRemoved> { return this.onDidRemoveBookmarkEmitter.event; }

    private onDidUpdateBookmarkEmitter = new vscode.EventEmitter<BookmarkUpdated>();
    get onDidUpdateBookmark(): vscode.Event<BookmarkUpdated> { return this.onDidUpdateBookmarkEmitter.event; }

// tslint:disable-next-line: member-ordering
    public static normalize(uri: string): string {
            // a simple workaround for what appears to be a vscode.Uri bug
            // (inconsistent fsPath values for the same document, ex. ///foo/x.cpp and /foo/x.cpp)
            return uri.replace("///", "/");
        }
        
// tslint:disable-next-line: member-ordering
        // public storage: Storage.BookmarksStorage;
        // public bookmarks: File[];
// tslint:disable-next-line: member-ordering
        public activeFile: File = undefined;

        constructor(workspaceFolder: WorkspaceFolder | undefined) {
            this.workspaceFolder = workspaceFolder;
            this.files = [];
        }

        public dispose() {
            this.zip();
        }
        
        public fromUri(uri: Uri) {

            if (uri.scheme === UNTITLED_SCHEME) {
                for (const file of this.files) {
                    if (file.uri?.toString() === uri.toString()) {
                        return file;
                    }
                }
                return;
            }

            const uriPath = !this.workspaceFolder 
                ? uri.path
                : getRelativePath(this.workspaceFolder.uri.path, uri.path);

            for (const file of this.files) {
                if (file.path === uriPath) {
                    return file;
                }
            }
        }

        public addFile(uri: Uri) {

            if (uri.scheme === UNTITLED_SCHEME) {

                // const untitleds = this.files.filter((file) => {
                //     return file.uri;
                // })?.map(file => file.path);

                // if (untitleds?.indexOf(uri.path) < 0) {
                //     const file = createFile(uri.path, uri);
                //     this.files.push(file);
                // }

                let found: File;
                for (const file of this.files) {
                    if (file.uri?.path === uri.path) {
                        found = file;
                    }
                }

                if (!found) {
                    const file = createFile(uri.path, uri);
                    this.files.push(file);
                }
                return;
            }

            const uriPath = !this.workspaceFolder 
                ? uri.path 
                : getRelativePath(this.workspaceFolder.uri.path, uri.path);

            const paths = this.files.map(file => file.path);
            if (paths.indexOf(uriPath) < 0) {
                const bookmark = createFile(uriPath);
                this.files.push(bookmark);
            }
        }

        public nextDocumentWithBookmarks(active: File, direction: Directions) {

            let currentBookmark: File = active;
            let currentBookmarkId: number;
            for (let index = 0; index < this.files.length; index++) {
                const element = this.files[index];
                if (element === active) {
                    currentBookmarkId = index;
                }
            }

            // eslint-disable-next-line no-async-promise-executor
            return new Promise(async (resolve, reject) => {

                const wrapNavigation: boolean = vscode.workspace.getConfiguration("bookmarks").get("wrapNavigation", true);

                let wrapStatus: number;

                if (direction === Directions.Forward) {
                  currentBookmarkId++;
                  if (currentBookmarkId === this.files.length) {
                      currentBookmarkId = wrapNavigation ? 0 : currentBookmarkId - 1;
                      wrapStatus = wrapNavigation ? null : NO_BOOKMARKS_AFTER;
                  }
                } else {
                  currentBookmarkId--;
                  if (currentBookmarkId === -1) {
                      currentBookmarkId = wrapNavigation ? this.files.length - 1 : currentBookmarkId + 1;
                      wrapStatus = wrapNavigation ? null : NO_BOOKMARKS_BEFORE;
                  }
                }

                if (wrapStatus && !wrapNavigation) {
                    reject(wrapStatus);
                    return;
                }
                
                currentBookmark = this.files[currentBookmarkId];
                
                if (currentBookmark.bookmarks.length === 0) {                    
                    if (currentBookmark === this.activeFile) {
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
                    if (await uriExists(this.getFileUri(currentBookmark))) {
                        resolve(currentBookmark.uri ? currentBookmark.uri : currentBookmark.path);
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

        public clear(book?: File): void {
            const b: File = book ? book : this.activeFile;
            clear(b);
            this.onDidClearBookmarksEmitter.fire({file: b, reason: BookmarkClearEventReason.singleFile})
            updateLinesWithBookmarkContext(this.activeFile);
        }
        
        public clearAll(): void {
            for (const element of this.files) {
                clear(element);
            }     
            this.onDidClearBookmarksEmitter.fire({reason: BookmarkClearEventReason.allFiles})
            updateLinesWithBookmarkContext(this.activeFile);
        }

        private decideToggleState(selections: readonly vscode.Selection[]): ToggleState {
            if (this.activeFile.bookmarks.length === 0) {
                return ToggleState.on;
            }
            
            const lines = selections.map(item => item.active.line);
            if (lines.every(elem => this.activeFile.bookmarks.map(item => item.line).indexOf(elem) > -1) ) {
                return ToggleState.off;
            } else {
                return ToggleState.on;
            }
        }

        public async toggle(selections: readonly vscode.Selection[], label?: string, book?: File): Promise<boolean> {
            const b: File = book ? book : this.activeFile;
            const toggleMode = vscode.workspace.getConfiguration("bookmarks").get<string>("multicursor.toggleMode", "allLinesAtOnce");
            let toggleState: ToggleState | undefined;
            if (toggleMode === ToggleMode.allLinesAtOnce) {
                toggleState = this.decideToggleState(selections);
                if (toggleState === ToggleState.off && label !== undefined) {
                    toggleState = ToggleState.editLabel;
                }
            }

            // eslint-disable-next-line no-async-promise-executor
            return new Promise<boolean>(async (resolve, reject) => {
                let added = false;
                const toggledLines: number[] = [];

                for (const selection of selections) {                
                    if (toggledLines.indexOf(selection.active.line) >= 0) {
                        continue;
                    }
                    toggledLines.push(selection.active.line);

                    if (toggleState === undefined) {
                        // toggle off -> delete
                        const index = indexOfBookmark(b, selection.active.line);
                        if (index > -1) {
                            this.removeBookmark(index, selection.active.line, b);
                        } else { // toggle on -> add
                            await this.addBookmark(selection.active, label, b);
                            added = true;
                        }
                    } else {
                        const index = indexOfBookmark(b, selection.active.line);
                        if (toggleState === ToggleState.editLabel) {
                            this.updateLabel(index, selection.active, label);
                        } else if (toggleState === ToggleState.off) {
                            this.removeBookmark(index, selection.active.line, b);
                        } else {
                            if (index === -1) {
                                await this.addBookmark(selection.active, label, b);
                            }
                            added = true;
                        }
                    }
                }
                return resolve(added);
            });
        }


        public async addBookmark(position: vscode.Position, label?: string, book?: File): Promise<void> {
            const b: File = book ? book : this.activeFile;
            if (!label) {
                b.bookmarks.push({
                    line: position.line,
                    column: position.character,
                    label: ""
                });
                let linePreview: string;
                if (book) {
                    linePreview = await getLinePreview(this.getFileUri(book), position.line);
                } else {
                    linePreview = vscode.window.activeTextEditor.document.lineAt(position.line).text.trim();
                }

                this.onDidAddBookmarkEmitter.fire({
                    file: b, 
                    line: position.line + 1,
                    column: position.character + 1,
                    linePreview,
                    uri: this.getFileUri(b)
                });
            } else {
                b.bookmarks.push({ 
                    line: position.line, 
                    column: position.character, 
                    label
                });
                this.onDidAddBookmarkEmitter.fire({
                    file: b, 
                    line: position.line + 1,
                    column: position.character + 1,
                    label,
                    uri: this.getFileUri(b)
                });
            }
        }

        public removeBookmark(index: number, aline: number, book?: File): void {
            const b: File = book ? book : this.activeFile;
            b.bookmarks.splice(index, 1);
            this.onDidRemoveBookmarkEmitter.fire({
                bookmark: b, 
                line: aline + 1
            });
        }

        public updateLabel(index: number, position: vscode.Position, newLabel: string): void {
            this.activeFile.bookmarks[index].line = position.line;
            this.activeFile.bookmarks[index].column = position.character;
            this.activeFile.bookmarks[index].label = newLabel;
            if (newLabel === '' || newLabel === undefined) {
                this.onDidUpdateBookmarkEmitter.fire({
                    file: this.activeFile,
                    index,
                    line: position.line + 1,
                    column: position.character + 1,
                    linePreview: vscode.window.activeTextEditor.document.lineAt(position.line).text.trim()
                });
            } else {
                this.onDidUpdateBookmarkEmitter.fire({
                    file: this.activeFile,
                    index,
                    line: position.line + 1,
                    column: position.character + 1,
                    label: newLabel
                });
            }
        }

        public updateBookmark(index: number, oldLine: number, newLine: number, book?: File): void {
            const b: File = book ? book : this.activeFile;
            b.bookmarks[index].line = newLine;
            if (!b.bookmarks[index].label) {
                this.onDidUpdateBookmarkEmitter.fire({
                    file: b,
                    index,
                    line: newLine + 1,
                    linePreview: vscode.window.activeTextEditor.document.lineAt(newLine).text.trim()
                });    
            } else {
                this.onDidUpdateBookmarkEmitter.fire({
                    file: b,
                    index,
                    line: newLine + 1,
                    label: b.bookmarks[index].label
                });    
            }
        }

        public hasAnyBookmark(): boolean {
            // let totalBookmarkCount = 0;
            // for (const element of this.files) {
            //     totalBookmarkCount = totalBookmarkCount + element.bookmarks.length; 
            // }
            // return totalBookmarkCount > 0;
            return this.countBookmarks() > 0;
        }

        public countBookmarks(): number {
            let totalBookmarkCount = 0;
            for (const element of this.files) {
                totalBookmarkCount = totalBookmarkCount + element.bookmarks.length; 
            }
            return totalBookmarkCount;
        }

        public countFilesWithBookmarks(): number {
            let totalFilesWithBookmarks = 0;
            for (const element of this.files) {
                if (element.bookmarks.length > 0) {
                    totalFilesWithBookmarks++;
                }
            }
            return totalFilesWithBookmarks;
        }

        ///
        public loadFrom(jsonObject, relativePath?: boolean) {
            if (jsonObject === "") {
                return;
            }

            // this.storage.load(jsonObject, relativePath, 
            //     vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined);
            // OLDER v1 format
            if ((jsonObject.bookmarks)) {

                for (const file of jsonObject.bookmarks) {
                    // if (relativePath) {
                    //     file.fsPath = file.fsPath.replace(WORKSPACE_ROOTPATH, vscode.workspace.workspaceFolders[0].uri.fsPath);
                    // }
                    // const fi = createFile(file.fsPath);
                    const bookmark = relativePath
                        ? createFile(file.path.replace(`$ROOTPATH$${path.sep}`, ""))
                        : createFile(getRelativePath(this.workspaceFolder?.uri?.fsPath, file.path));

                    // Win32 uses `\\` but uris always uses `/`
                    if (os.platform() === "win32") {
                        bookmark.path = bookmark.path.replace(/\\/g, "/");
                    }

                    for (const bkm of file.bookmarks) {
                        bookmark.bookmarks.push(bkm);
                    }
                    this.files.push(bookmark);
                }
                return;
            }
            
            // NEW v2 format
            if (!jsonObject.files) { 
                for (const file of jsonObject) {

                    // untitled files, ignore (for now)
                    const ff = <string>file.path;
                    if (ff.match(/Untitled-\d+/)) {
                        continue;
                    }

                    // if (relativePath) {
                    //     file.path = file.path.replace(WORKSPACE_ROOTPATH, vscode.workspace.workspaceFolders[0].uri.fsPath);
                    // }
                    // const fi = createFile(file.path);
                    const bookmark = relativePath
                        ? createFile(file.path.replace(`$ROOTPATH$${path.sep}`, ""))
                        : createFile(getRelativePath(this.workspaceFolder?.uri?.fsPath, file.path));

                    // Win32 uses `\\` but uris always uses `/`
                    if (os.platform() === "win32") {
                        bookmark.path = bookmark.path.replace(/\\/g, "/");
                    }

                    for (const bkm of file.bookmarks) {
                        bookmark.bookmarks.push({
                            line: bkm.line, 
                            column: bkm.column, 
                            label: bkm.label
                        });
                    }
                    this.files.push(bookmark);
                }
                return;
            }

            // NEWER v3 format
            for (const file of jsonObject.files) {
                const bookmark = createFile(file.path);//??, file.uri ? <Uri>file.uri : undefined);
                bookmark.bookmarks = [
                    ...file.bookmarks
                ]
                this.files.push(bookmark);
            }
        }
        
        public zip(): Controller {
            // return this.storage.save(relativePath, this.updateRelativePath);
            function isNotEmpty(file: File): boolean {
                return file.bookmarks.length > 0;
            }

            function isValid(file: File): boolean {
                return !file.uri ; // Untitled files
            }

            function canBeSaved(file: File): boolean {
                return isValid(file) && isNotEmpty(file);
            }

            const newController: Controller = new Controller(this.workspaceFolder);
            newController.files = JSON.parse(JSON.stringify(this.files)).filter(canBeSaved);
            
            delete newController.workspaceFolder;
            delete newController.onDidClearBookmarksEmitter;
            delete newController.onDidAddBookmarkEmitter;
            delete newController.onDidRemoveBookmarkEmitter;
            delete newController.onDidUpdateBookmarkEmitter;

            return newController;
        }

        // private updateRelativePath = (path: string): string => {
        //     const wsPath: vscode.WorkspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(path));
        //     if (wsPath) {
        //         path = path.replace(wsPath.uri.fsPath, "$ROOTPATH$"); 
        //     }
        //     return path;
        // }
        public updateFilePath(oldFilePath: string, newFilePath: string): void {
            for (const file of this.files) {
                if (file.path === oldFilePath) {
                    file.path = newFilePath;
                    break;
                }
            }
        }

        public updateDirectoryPath(oldDirectoryPath: string, newDirectoryPath: string): void {
            for (const file of this.files) {
                if (file.path.startsWith(oldDirectoryPath)) {
                    file.path = file.path.replace(oldDirectoryPath, newDirectoryPath);
                }
            }
        }

        public getFileUri(file: File): Uri {
            return getFileUri(file, this.workspaceFolder);
        }
    }
