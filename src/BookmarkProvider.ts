import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { Bookmarks } from "./Bookmarks";

export const NODE_FILE = 0;
export const NODE_BOOKMARK = 1;
export enum BookmarkNodeKind { NODE_FILE, NODE_BOOKMARK };

export interface BookmarkPreview {
  file: string;
  line: number;    
  preview: string; 
};

let context: vscode.ExtensionContext;
let hasIcons: boolean = vscode.workspace.getConfiguration("workbench").get("iconTheme", "") !== null;

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
              arguments: [bbb.file/*element.label*/, bbb.line],
            }));
          }

          // for (let bb of this.bookmarks.bookmarks) {
          //   if (bb.fsPath === element.label) {
          //     for (let obb of bb.bookmarks) {
          //       ll.push(new BookmarkNode(obb.toString(), vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK))
          //     }
          //   }
          // }
          resolve(ll);
        } else {
          resolve([]);
        }
      } else {

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
                            file: elementInside.detail,
                            line: elementInside.label,
                            preview: "Line " + elementInside.label + ": " + elementInside.description
                          }
                          );
                      }
                    }
                  }
                }

                let itemPath = removeRootPathFrom(bb.fsPath);
                lll.push(new BookmarkNode(itemPath/*bb.fsPath*/, vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE, books));
              }
            }

            resolve(lll);
          }
        );
      }
    });
  }

}

function removeRootPathFrom(path: string): string {
  if (!vscode.workspace.rootPath) {
    return path;
  }

  if (path.indexOf(vscode.workspace.rootPath) === 0) {
    return path.split(vscode.workspace.rootPath).pop().substr(1);
  } else {
    return path;
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
      if (hasIcons) {
        this.iconPath = {
          light: context.asAbsolutePath("images/bookmark-explorer-light.svg"),
          dark: context.asAbsolutePath("images/bookmark-explorer-dark.svg")
        }; 
      }
    } else {
      this.iconPath = {
        light: context.asAbsolutePath("images/bookmark.svg"),
        dark: context.asAbsolutePath("images/bookmark.svg")
      }; 
    }
  }

  contextValue = "BookmarkNode";

}