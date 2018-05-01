import fs = require("fs");
import path = require("path");

export namespace Storage {

    export const WORKSPACE_UNDEFINED = '$UNTITLED$';
    export const WORKSPACE_SINGLE    = '.';

    /**
     * Declares a single *Bookmark* (line, column and label)
     */
    export interface Bookmark {
        line: number;
        column?: number;
        label?: string;
    }

    /**
     * Declares a *File with Bookmarks*, with its `path` and list of `Bookmark`
     */
    export interface File {
        path: string;
        bookmarks: Bookmark[];
    };

    /**
     * Declares a *Workspace*, with its `path` (relative or not, it doest not matter) and list of 
     * `File` that contains `Bookmark`
     */
    // export interface Workspace {
    //     path: string;
    //     files: File[];
    // }

    /**
     * Declares a list of `File` (in `Array` form)
     */
    interface FileList extends Array<File> { };

    /**
     * Declares a list of `Workspace` (in `Array` form)
     */
    // interface WorkspaceList extends Array<Workspace> { };

    class BookmarkItem implements Bookmark {

        public line: number;
        public column?: number;
        public label?: string;

        constructor(pline: number, pcolumn: number = 0, plabel?: string) {
            this.line = pline;
            this.column = pcolumn;
            this.label = plabel;
        }
    }

    /**
     * Implements a `File`, to be used in _persistance_ routine
     */
    class FileItem implements File {

        public path: string;
        public bookmarks: Bookmark[];

        constructor(pname: string) {
            this.path = pname;
            this.bookmarks = [];
        }
    }

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
            this.fileList.push(new FileItem(filePath));
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
        //                 const fi: FileItem = new FileItem(file.fsPath);
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
                    for (const file of jsonObject.bookmarks) {
                        const fi: FileItem = new FileItem(file.fsPath);
                        for (const bkm of file.bookmarks) {
                            fi.bookmarks.push(new BookmarkItem(bkm));
                        }
                        // wi.files.push(fi);
                        this.fileList.push(fi);
                    }
                    // this.workspaceList.push(wi);

                    this.save(folder);
                } else { // NEW format
                    this.fileList = jsonObject as FileList;
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
        public save(folder: string) {
            // fs.writeFileSync(path.join(folder, "teste-bookmarks.json"), JSON.stringify(this.workspaceList, null, "\t"));
            fs.writeFileSync(path.join(folder, "teste-bookmarks-fileList.json"), JSON.stringify(this.fileList, null, "\t"));
        }
    }
}