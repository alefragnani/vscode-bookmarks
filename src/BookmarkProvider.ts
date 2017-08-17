import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { Bookmarks } from "./Bookmarks";

export const NODE_FILE = 0;
export const NODE_BOOKMARK = 1;
export enum BookmarkNodeKind { NODE_FILE, NODE_BOOKMARK };

export interface BookmarkPreview {
  line: number;     // the name that the user defines for the project
  preview: string; // the root path of this project
};

let context: vscode.ExtensionContext;

export class BookmarkProvider implements vscode.TreeDataProvider<BookmarkNode> {

  private _onDidChangeTreeData: vscode.EventEmitter<BookmarkNode | undefined> = new vscode.EventEmitter<BookmarkNode | undefined>();
  readonly onDidChangeTreeData: vscode.Event<BookmarkNode | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string, private bookmarks: Bookmarks, ctx: vscode.ExtensionContext) {
    context = ctx;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: BookmarkNode): vscode.TreeItem {
    return element;
  }

  // very much based in `listFromAllFiles` command
  getChildren(element?: BookmarkNode): Thenable<BookmarkNode[]> {

    // no bookmark
    let totalBookmarkCount: number = 0;
    for (let elem of this.bookmarks.bookmarks) {
      totalBookmarkCount = totalBookmarkCount + elem.bookmarks.length;
    }

    if (totalBookmarkCount === 0) {
      vscode.window.showInformationMessage("No Bookmarks in this project.");
      return Promise.resolve([]);
    }

    // loop !!!
    return new Promise(resolve => {
      if (element) {

        if (element.kind === BookmarkNodeKind.NODE_FILE) {
          //resolve(return new BookmarkNode(element.label, vscode.TreeItemCollapsibleState.Collapsed, element.)));
          let ll: BookmarkNode[] = [];


          for (let bbb of element.books) {
            ll.push(new BookmarkNode(bbb.preview, vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK, [], {
              command: "bookmarks.jumpTo",
              title: "",
              arguments: [element.label, bbb.line],
            }));
          }

          // for (let bb of this.bookmarks.bookmarks) {
          //   if (bb.fsPath === element.label) {
          //     for (let obb of bb.bookmarks) {
          //       ll.push(new BookmarkNode(obb.toString(), vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK))
          //     }
          //   }
          // }


          // ll.push(new BookmarkNode("ASDFASDF", vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK));
          // ll.push(new BookmarkNode("ASDFASDF", vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK));
          // ll.push(new BookmarkNode("ASDFADSF", vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK));
          resolve(ll);
        } else {
          resolve([]);
        }
        //resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, "node_modules", element.label, "package.json")));
      } else {

        //*
        // ROOT
        let promisses = [];
        for (let bookmark of this.bookmarks.bookmarks) {
          let pp = bookmark.listBookmarks();
          promisses.push(pp);
        }

        Promise.all(promisses).then(
          (values) => {

            // raw list
            let lll: BookmarkNode[] = [];
            for (let bb of this.bookmarks.bookmarks) {

              // this bookmark has bookmarks?
              if (this.bookmarks.bookmarks.length > 0) {

                let books: BookmarkPreview[] = [];

                // search from `values`
                for (let element of values) {
                  if (element) {
                    for (let elementInside of element) {

                      if (bb.fsPath === elementInside.detail) {
                        //let itemPath = removeRootPathFrom(elementInside.detail);
                        //lll.push(new BookmarkNode(itemPath, vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE));
                        //books.push("Line " + elementInside.label + ": " + elementInside.description);
                        books.push(
                          {
                            line: elementInside.label,
                            preview: "Line " + elementInside.label + ": " + elementInside.description
                          }
                          );
                      }
                    }
                  }
                }

                // let itemPath = removeRootPathFrom(bb.fsPath);
                lll.push(new BookmarkNode(bb.fsPath, vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE, books));
              }
            }

            // let ll: BookmarkNode[] = [];
            // for (let element of values) {
            //     if (element) {
            //       for (let elementInside of element) {
            //           let itemPath = removeRootPathFrom(elementInside.detail);
            //           ll.push(new BookmarkNode(itemPath, vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE));
            //       }    
            //     }    
            // }
            resolve(lll);
          }
        );


        //*/  


        /*

        // const packageJsonPath = path.join(this.workspaceRoot, "package.json");
        // if (this.pathExists(packageJsonPath)) {
        //   resolve(this.getDepsInPackageJson(packageJsonPath));
        // } else {
        //   vscode.window.showInformationMessage("Workspace has no package.json");
        //   resolve([]);
        // }
        let ll: BookmarkNode[] = [];
        for (let bb of this.bookmarks.bookmarks) {
          if (this.bookmarks.bookmarks.length > 0) {
            ll.push(new BookmarkNode(bb.fsPath, vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE));
          }
        }
        // ll.push(new BookmarkNode("um", vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE));
        // ll.push(new BookmarkNode("dopis", vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE));
        // ll.push(new BookmarkNode("tres", vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE));
        resolve(ll);
        
        */
      }
    });
  }

  // getChildrenDEPS(element?: BookmarkNode): Thenable<BookmarkNode[]> {
  //   if (!this.workspaceRoot) {
  //     vscode.window.showInformationMessage("No BookmarkNode in empty workspace");
  //     return Promise.resolve([]);
  //   }

  //   return new Promise(resolve => {
  //     if (element) {
  //       resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, "node_modules", element.label, "package.json")));
  //     } else {
  //       const packageJsonPath = path.join(this.workspaceRoot, "package.json");
  //       if (this.pathExists(packageJsonPath)) {
  //         resolve(this.getDepsInPackageJson(packageJsonPath));
  //       } else {
  //         vscode.window.showInformationMessage("Workspace has no package.json");
  //         resolve([]);
  //       }
  //     }
  //   });  
  // }

  // /**
  //  * Given the path to package.json, read all its dependencies and devDependencies.
  //  */
  // private getDepsInPackageJson(packageJsonPath: string): BookmarkNode[] {
  //   if (this.pathExists(packageJsonPath)) {
  //     const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  //     const toDep = (moduleName: string): BookmarkNode => {
  //       if (this.pathExists(path.join(this.workspaceRoot, "node_modules", moduleName))) {
  //         return new BookmarkNode(moduleName, vscode.TreeItemCollapsibleState.Collapsed);
  //       } else {
  //         return new BookmarkNode(moduleName, vscode.TreeItemCollapsibleState.None, {
  //           command: "extension.openPackageOnNpm",
  //           title: "",
  //           arguments: [moduleName],
  //         });
  //       }
  //     }

  //     const deps = packageJson.dependencies
  //       ? Object.keys(packageJson.dependencies).map(toDep)
  //       : [];
  //     const devDeps = packageJson.devDependencies
  //       ? Object.keys(packageJson.devDependencies).map(toDep)
  //       : [];
  //     return deps.concat(devDeps);
  //   } else {
  //     return [];
  //   }
  // }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }

    return true;
  }
}

function removeRootPathFrom(path: string): string {
  if (!vscode.workspace.rootPath) {
    return path;
  }

  if (path.indexOf(vscode.workspace.rootPath) === 0) {
    return path.split(vscode.workspace.rootPath).pop();
  } else {
    return "$(file-directory) " + path;
  }
}

class BookmarkNode extends vscode.TreeItem {

  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly kind: BookmarkNodeKind,
    public readonly books?: BookmarkPreview[],
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    if (kind === BookmarkNodeKind.NODE_FILE) {
      this.iconPath = {
        light: context.asAbsolutePath("images/document-light.svg"),
        dark: context.asAbsolutePath("images/document-dark.svg")
      }; 
    } else {
      this.iconPath = {
        light: context.asAbsolutePath("images/bookmark.svg"),
        dark: context.asAbsolutePath("images/bookmark.svg")
      }; 
    }
  }

  // iconPath = {
  //   // light: path.join(__filename, "..", "..", "..", "resources", "light", "images/bookmark.svg"),
  //   // dark: path.join(__filename, "..", "..", "..", "resources", "dark", "bookmark/bookmark.svg")
  //   light: context.asAbsolutePath("images/bookmark.svg"),
  //   dark: context.asAbsolutePath("images/bookmark.svg")
  // };

  contextValue = "BookmarkNode";

}