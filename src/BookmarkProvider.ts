import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import {Bookmarks} from "./Bookmarks";

export const NODE_FILE = 0;
export const NODE_BOOKMARK = 1;
export enum BookmarkNodeKind { NODE_FILE, NODE_BOOKMARK };

export class BookmarkProvider implements vscode.TreeDataProvider<BookmarkNode> {

  private _onDidChangeTreeData: vscode.EventEmitter<BookmarkNode | undefined> = new vscode.EventEmitter<BookmarkNode | undefined>();
  readonly onDidChangeTreeData: vscode.Event<BookmarkNode | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string, private bookmarks: Bookmarks) {
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

          for (let bb of this.bookmarks.bookmarks) {
            if (bb.fsPath === element.label) {
              for (let obb of bb.bookmarks) {
                ll.push(new BookmarkNode(obb.toString(), vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK))
              }
            }
          }
          // ll.push(new BookmarkNode("ASDFASDF", vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK));
          // ll.push(new BookmarkNode("ASDFASDF", vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK));
          // ll.push(new BookmarkNode("ASDFADSF", vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK));
          resolve(ll);
        } else {
          resolve([]);
        }
        //resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, "node_modules", element.label, "package.json")));
      } else {
        // const packageJsonPath = path.join(this.workspaceRoot, "package.json");
        // if (this.pathExists(packageJsonPath)) {
        //   resolve(this.getDepsInPackageJson(packageJsonPath));
        // } else {
        //   vscode.window.showInformationMessage("Workspace has no package.json");
        //   resolve([]);
        // }
        let ll: BookmarkNode[] = [];
        for (let bb of this.bookmarks.bookmarks) {
          ll.push(new BookmarkNode(bb.fsPath, vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE));
        }
        // ll.push(new BookmarkNode("um", vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE));
        // ll.push(new BookmarkNode("dopis", vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE));
        // ll.push(new BookmarkNode("tres", vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE));
        resolve(ll);
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

class BookmarkNode extends vscode.TreeItem {

  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly kind: BookmarkNodeKind,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
  }

  iconPath = {
    light: path.join(__filename, "..", "..", "..", "resources", "light", "images/bookmark.svg"),
    dark: path.join(__filename, "..", "..", "..", "resources", "dark", "bookmark/bookmark.svg")
  };

  contextValue = "BookmarkNode";

}