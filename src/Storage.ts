import fs = require("fs");
import path = require("path");

import { Bookmark, File, FileList, BookmarkedFile, BookmarkItem } from "./Bookmark";

export namespace Storage {

    export const WORKSPACE_ROOTPATH  = "$ROOTPATH$";
    export const WORKSPACE_UNDEFINED = '$UNTITLED$';
    export const WORKSPACE_SINGLE    = '.';

    /**
     * Implements *THE `Storage`*
     */
    export class BookmarksStorage {

        public fileList: FileList;
        constructor() {
            this.fileList = <FileList>[]
        }

        /**
         * Adds a file to the list
         * 
         * @param `filepath` The [File path](#File.path)
         *
         * @return `void`
         */
        public pushFile(filePath: string): void {
            this.fileList.push(new BookmarkedFile(filePath));
        }

        /**
         * Loads the `bookmarks.json` file
         *
         * @return A `string` containing the _Error Message_ in case something goes wrong. 
         *         An **empty string** if everything is ok.
         */
        public load(jsonObject: any, relativePath: boolean, folder: string): string {
            try {
                // OLD format
                if ((jsonObject.bookmarks)) {

                    for (let file of jsonObject.bookmarks) {
                        if (relativePath) {
                            file.fsPath = file.fsPath.replace(WORKSPACE_ROOTPATH, folder);
                        }
                        const fi: BookmarkedFile = new BookmarkedFile(file.fsPath);
                        for (const bkm of file.bookmarks) {
                            fi.bookmarks.push(new BookmarkItem(bkm));
                        }
                        this.fileList.push(fi);
                    }
                    this.saveLoaded(folder);
                } else { // NEW format
                    for (let file of jsonObject) {
                        if (relativePath) {
                            file.path = file.path.replace(WORKSPACE_ROOTPATH, folder);
                        }
                        const fi: BookmarkedFile = new BookmarkedFile(file.path);
                        for (const bkm of file.bookmarks) {
                            fi.bookmarks.push(new BookmarkItem(bkm.line, bkm.column, bkm.label));
                        }
                        this.fileList.push(fi);
                    }
                    this.saveLoaded(folder);
                }
                return "";
            } catch (error) {
                console.log(error);
                return error.toString();
            }
        }

        /**
         * Saves the `bookmarks.json` file to disk
         * 
         * @param `split` Should it save each workspace it it's own folder? 
         * 
         * @return `void`
         */
        public saveLoaded(folder: string) {
            if (!folder) {
                return;
            }
            fs.writeFileSync(path.join(folder, "teste-bookmarks-fileList.json"), JSON.stringify(this.fileList, null, "\t"));
        }

        public save(relativePath: boolean, updateRelativePath: (path: string) => string): any {
            
            function isNotEmpty(file: File): boolean {
                return file.bookmarks.length > 0;
            }

            let newStorage: Storage.BookmarksStorage = new Storage.BookmarksStorage();
            newStorage.fileList = JSON.parse(JSON.stringify(this.fileList)).filter(isNotEmpty);
            if (!relativePath) {
                return newStorage.fileList;
            }

            for (let element of newStorage.fileList) {
                element.path = updateRelativePath(element.path);
            }
            return newStorage.fileList;
        }
    }
}