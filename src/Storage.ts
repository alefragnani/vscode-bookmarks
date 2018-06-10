import fs = require("fs");
import path = require("path");

import { Bookmark, File, FileList, BookmarkedFile, BookmarkItem } from "./Bookmark";

export namespace Storage {

    export const WORKSPACE_ROOTPATH  = "$ROOTPATH$";
    export const WORKSPACE_UNDEFINED = '$UNTITLED$';
    export const WORKSPACE_SINGLE    = '.';


    /**
     * Declares a *Workspace*, with its `path` (relative or not, it doest not matter) and list of 
     * `File` that contains `Bookmark`
     */
    // export interface Workspace {
    //     path: string;
    //     files: File[];
    // }


    /**
     * Declares a list of `Workspace` (in `Array` form)
     */
    // interface WorkspaceList extends Array<Workspace> { };



    /**
     * Implements a `File`, to be used in _persistance_ routine
     */
    // class BookmarkedFile implements File {

    //     public path: string;
    //     public bookmarks: Bookmark[];

    //     constructor(pname: string) {
    //         this.path = pname;
    //         this.bookmarks = [];
    //     }

    //     public nextBookmark() {
    //     };
    //     public listBookmarks() {
    //     };
    //     public clear(): void {
    //     };
        
    // }

    /**
     * Implements a `Workspace`, to be used in _persistance_ routine
     */
    // class WorkspaceItem implements Workspace {

    //     public path: string;
    //     public files: File[];

    //     constructor(wpath: string) {
    //         this.path = wpath;
    //         this.files = [];
    //     }
    // }

    /**
     * Implements *THE `Storage`*
     */
    export class BookmarksStorage {

        // public workspaceList: WorkspaceList;

        // constructor() {
        //     this.workspaceList = <WorkspaceList>[];
        // }

        public fileList: FileList;
        constructor() {
            this.fileList = <FileList>[]
        }

        /**
         * Adds a workspace to the list
         * 
         * @param `path` The [Workspace path](#Workspace.path)
         *
         * @return `void`
         */
        // public pushWorkspace(wpath: string): void {
        //     this.workspaceList.push(new WorkspaceItem(wpath));
        //     return;
        // }
        public pushFile(filePath: string): void {
            this.fileList.push(new BookmarkedFile(filePath));
        }

        /**
         * Removes a project to the list
         * 
         * @param `name` The [Project Name](#Project.name)
         *
         * @return The [Project](#Project) that was removed
         */
        // public popWorkspace(wpath: string): Workspace {
        //     for (let index = 0; index < this.workspaceList.length; index++) {
        //         const element: Workspace = this.workspaceList[ index ];
        //         if (element.path.toLowerCase() === wpath.toLowerCase()) {
        //             return this.workspaceList.splice(index, 1)[ 0 ];
        //         }
        //     }
        // }

        /**
         * Adds another `path` to a project
         * 
         * @param `name` The [Project Name](#Project.name)
         * @param `path` The [Project Path](#Project.paths)
         *
         * @return `void`
         */
        // public addPath(name: string, path: string): void {
        //     // for (let index = 0; index < this.projectList.length; index++) {
        //     for (const element of this.workspaceList) {
        //         // let element: Project = this.projectList[index];
        //         if (element.name.toLowerCase() === name.toLowerCase()) {
        //             // this.projectList[index].paths.push(path);
        //             element.paths.push(path);
        //         }
        //     }
        // }

        /**
         * Removes a `path` from a project
         * 
         * @param `name` The [Project Name](#Project.name)
         * @param `path` The [Project Path](#Project.paths)
         *
         * @return `void`
         */
        // public removePath(name: string, path: string): void {
        //     // for (let index = 0; index < this.projectList.length; index++) {
        //     for (const element of this.workspaceList) {
        //         // let element: Project = this.projectList[index];
        //         if (element.name.toLowerCase() === name.toLowerCase()) {

        //             for (let indexPath = 0; indexPath < element.paths.length; indexPath++) {
        //                 const elementPath = element.paths[ indexPath ];
        //                 if (elementPath.toLowerCase() === path.toLowerCase()) {
        //                     // this.projectList[index].paths.splice(indexPath, 1);
        //                     element.paths.splice(indexPath, 1);
        //                     return;
        //                 }
        //             }
        //         }
        //     }
        // }

        /**
         * Checks if exists a project with a given `name`
         * 
         * @param `name` The [Project Name](#Project.name) to search for projects
         *
         * @return `true` or `false`
         */
        // public workspaceExists(wpath: string): boolean {
        //     let found: boolean = false;
        //     for (const element of this.workspaceList) {
        //         if (element.path.toLocaleLowerCase() === wpath.toLocaleLowerCase()) {
        //             found = true;
        //         }
        //     }
        //     return found;
        // }

        /**
         * Checks if exists a project with a given `rootPath`
         * 
         * @param `rootPath` The path to search for projects
         *
         * @return A [Project](#Project) with the given `rootPath`
         */
        // public existsWithRootPath(rootPath: string): File {
        //     const rootPathUsingHome: string = "";// = PathUtils.compactHomePath(rootPath).toLocaleLowerCase();

        //     for (const element of this.workspaceList) {
        //         if ((element.rootPath.toLocaleLowerCase() === rootPath.toLocaleLowerCase()) || (element.rootPath.toLocaleLowerCase() === rootPathUsingHome)) {
        //             return element;
        //         }
        //     } 
        // }

        /**
         * Returns the number of projects stored in `projects.json`
         * 
         * > The _dynamic projects_ like VSCode and Git aren't present
         *
         * @return The number of projects
         */
        // public length(): number {
        //     return this.workspaceList.length;
        // }

        /**
         * Loads the `bookmarks.json` file
         *
         * @return A `string` containing the _Error Message_ in case something goes wrong. 
         *         An **empty string** if everything is ok.
         */
        // public load(jsonObject: any, relativePath: boolean, folder: string): string {
        //     try {
        //         // OLD format
        //         if ((jsonObject.bookmarks)) {

        //             const wi: WorkspaceItem = new WorkspaceItem(!relativePath ? WORKSPACE_SINGLE : folder);
        //             // new WorkspaceItem(WORKSPACE_SINGLE);
        //             for (const file of jsonObject.bookmarks) {
        //                 const fi: BookmarkedFile = new BookmarkedFile(file.fsPath);
        //                 for (const bkm of file.bookmarks) {
        //                     fi.bookmarks.push(new BookmarkItem(bkm));
        //                 }
        //                 wi.files.push(fi);
        //             }
        //             this.workspaceList.push(wi);

        //             this.save(folder);
        //         } else { // NEW format
        //             this.workspaceList = jsonObject as WorkspaceList;
        //         }
        //         return "";
        //     } catch (error) {
        //         console.log(error);
        //         return error.toString();
        //     }
        // }
        public load(jsonObject: any, relativePath: boolean, folder: string): string {
            try {
                // OLD format
                if ((jsonObject.bookmarks)) {

                    // const wi: WorkspaceItem = new WorkspaceItem(!relativePath ? WORKSPACE_SINGLE : folder);

                    // new WorkspaceItem(WORKSPACE_SINGLE);
                    for (let file of jsonObject.bookmarks) {
                        if (relativePath) {
                            file.fsPath = file.fsPath.replace(WORKSPACE_ROOTPATH, folder);
                        }
                        const fi: BookmarkedFile = new BookmarkedFile(file.fsPath);
                        for (const bkm of file.bookmarks) {
                            fi.bookmarks.push(new BookmarkItem(bkm));
                        }
                        // wi.files.push(fi);
                        this.fileList.push(fi);
                    }
                    // this.workspaceList.push(wi);

                    this.saveLoaded(folder);
                } else { // NEW format
                    //this.fileList = jsonObject as FileList;
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
            // fs.writeFileSync(path.join(folder, "teste-bookmarks.json"), JSON.stringify(this.workspaceList, null, "\t"));
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