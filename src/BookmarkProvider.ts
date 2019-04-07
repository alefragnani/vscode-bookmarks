import * as vscode from "vscode";
import path = require("path");
import { BookmarkedFile, File } from "./Bookmark";
import { BookmarksController } from "./Bookmarks";
import { Parser, Point } from "./Parser";

export const NODE_FILE = 0;
export const NODE_BOOKMARK = 1;
export enum BookmarkNodeKind { NODE_FILE, NODE_BOOKMARK };

export interface BookmarkPreview {
  bookmark:File,
  file: string;
  line: number;    
  column: number;
  preview: string; 
};

let context: vscode.ExtensionContext;

export class BookmarkProvider implements vscode.TreeDataProvider<BookmarkNode> {

  private _onDidChangeTreeData: vscode.EventEmitter<BookmarkNode | undefined> = new vscode.EventEmitter<BookmarkNode | undefined>();
  readonly onDidChangeTreeData: vscode.Event<BookmarkNode | undefined> = this._onDidChangeTreeData.event;

  private tree: BookmarkNode[] = [];

  constructor(private bookmarks: BookmarksController, ctx: vscode.ExtensionContext) {
    context = ctx;

    bookmarks.onDidClearBookmark( bkm => {
      this._onDidChangeTreeData.fire();
      this.showTreeView();
    });

    bookmarks.onDidClearAllBookmarks( bkm => {
      this._onDidChangeTreeData.fire();
      this.showTreeView();
    });

    bookmarks.onDidAddBookmark( bkm => {

      this.showTreeView();
      // no bookmark in this file
      if (this.tree.length === 0) {
        this._onDidChangeTreeData.fire();
        return;
      }

      // has bookmarks - find it
      for (let bn of this.tree) {
        if (bn.bookmark === bkm.bookmarkedFile) {
        
          if (!bkm.label) {
            bn.books.push({
              bookmark:bn.bookmark,
              file: bn.books[0].file,
              line: bkm.line,
              column: bkm.column,
              preview: bkm.linePreview + ":" + Parser.encodePosition(bkm.line, bkm.column)
            })
          } else {
            bn.books.push({
              bookmark:bn.bookmark,
              file: bn.books[0].file,
              line: bkm.line,
              column: bkm.column,
              preview: "\u270E " + bkm.label + ":" + Parser.encodePosition(bkm.line, bkm.column)
            });
          }

          bn.books.sort((n1, n2) => {
              if (n1.line > n2.line) {
                  return 1;
              }

              if (n1.line < n2.line) {
                  return -1;
              }

              return 0;
          });

          this._onDidChangeTreeData.fire(bn);
          return;
        }
      }

      // not found - new file
      this._onDidChangeTreeData.fire();
    });

    bookmarks.onDidRemoveBookmark( bkm => {

      this.showTreeView();
      // no bookmark in this file
      if (this.tree.length === 0) {
        this._onDidChangeTreeData.fire();
        return;
      }

      // has bookmarks - find it
      for (let bn of this.tree) {
        if (bn.bookmark === bkm.bookmark) {

          // last one - reset
          if (bn.books.length === 1) {
            this._onDidChangeTreeData.fire(null);
            return;
          }

          // remove just that one
          for (let index = 0; index < bn.books.length; index++) {
            let element = bn.books[index];
            if (element.line == bkm.line) {
              bn.books.splice(index, 1);
              this._onDidChangeTreeData.fire(bn);
              return;
            }
          }
        }
      }
    });

    bookmarks.onDidUpdateBookmark( bkm => {

      // no bookmark in this file
      if (this.tree.length === 0) {
        this._onDidChangeTreeData.fire();
        return;
      }

      // has bookmarks - find it
      for (let bn of this.tree) {
        if (bn.bookmark === bkm.bookmarkedFile) {
          
          bn.books[bkm.index].line = bkm.line;
          if (bkm.linePreview) {
            bn.books[bkm.index].preview =  bkm.linePreview + Parser.encodePosition(bn.books[bkm.index].line, bn.books[bkm.index].column)
          } else {
            bn.books[bkm.index].preview = "\u270E " +  bkm.label + Parser.encodePosition(bn.books[bkm.index].line, bn.books[bkm.index].column)
          }
          
          this._onDidChangeTreeData.fire(bn);
          return;
        }
      }

      // not found - new file
      this._onDidChangeTreeData.fire();
    });
  }

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: BookmarkNode): vscode.TreeItem {
    return element;
  }

  // very much based in `listFromAllFiles` command
  getChildren(element?: BookmarkNode): Thenable<BookmarkNode[]> {

    // no bookmark
    let totalBookmarkCount: number = 0;
    for (let elem of this.bookmarks.storage.fileList) {
      totalBookmarkCount = totalBookmarkCount + elem.bookmarks.length;
    }

    if (totalBookmarkCount === 0) {
      this.tree = [];
      return Promise.resolve([]);
    }

    // loop !!!
    return new Promise(resolve => {

      if (element) {

        if (element.kind === BookmarkNodeKind.NODE_FILE) {
          let ll: BookmarkNode[] = [];

          for (let bbb of element.books) {
            ll.push(new BookmarkNode(bbb.preview, vscode.TreeItemCollapsibleState.None, BookmarkNodeKind.NODE_BOOKMARK, null, [], {
              command: "bookmarks.jumpTo",
              title: "",
              arguments: [bbb.bookmark, bbb.line, bbb.column],
            }));
          }

          resolve(ll);
        } else {
          resolve([]);
        }
      } else {

        // ROOT
        this.tree = [];
        let promisses = [];
        for (let bookmark of this.bookmarks.storage.fileList) {
          let pp = bookmark.listBookmarks();
          promisses.push(pp);
        }

        Promise.all(promisses).then(
          (values) => {

            // raw list
            let lll: BookmarkNode[] = [];
            for (let bb of this.bookmarks.storage.fileList) {

              // this bookmark has bookmarks?
              if (bb.bookmarks.length > 0) {

                let books: BookmarkPreview[] = [];

                // search from `values`no
                for (let element of values) {
                  if (element) {
                    for (let elementInside of element) {

                      if (bb.path === elementInside.detail) {

                        const point: Point = Parser.parsePosition(elementInside.description);
                        books.push(
                          {
                            bookmark:bb,
                            file: elementInside.detail,
                            line: point.line,
                            column: point.column,
                            preview: elementInside.label.replace("$(tag)", "\u270E") + ": " + elementInside.description
                          }
                          );
                      }
                    }
                  }
                }

                let itemPath = removeBasePathFrom(bb.path);
                let bn: BookmarkNode = new BookmarkNode(itemPath, vscode.TreeItemCollapsibleState.Collapsed, BookmarkNodeKind.NODE_FILE, bb, books);
                lll.push(bn);
                this.tree.push(bn);
              }
            }

            resolve(lll);
          }
        );
      }
    });
  }

  showTreeView(): void {
    let canShowTreeView: boolean = vscode.workspace.getConfiguration("bookmarks").get("treeview.visible", true);
    vscode.commands.executeCommand("setContext", "bookmarks.canShowTreeView", canShowTreeView && this.bookmarks.hasAnyBookmark());
  }

}

function removeBasePathFrom(aPath: string): string {
  if (!vscode.workspace.workspaceFolders) {
    return aPath;
  }

  let inWorkspace: vscode.WorkspaceFolder;
  for (const wf of vscode.workspace.workspaceFolders) {
      if (aPath.indexOf(wf.uri.fsPath) === 0) {
          inWorkspace = wf;
          break;
      }
  }

  if (inWorkspace) {
    if (vscode.workspace.workspaceFolders.length === 1) {
      return aPath.split(inWorkspace.uri.fsPath).pop().substr(1);
    } else {
      return inWorkspace.name + path.sep + aPath.split(inWorkspace.uri.fsPath).pop().substr(1);
    }
  } else {
    return aPath;
  }
}

class BookmarkNode extends vscode.TreeItem {

  constructor(

    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly kind: BookmarkNodeKind,
    public readonly bookmark: BookmarkedFile,
    public readonly books?: BookmarkPreview[],
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    if (kind === BookmarkNodeKind.NODE_FILE) {
      this.resourceUri = bookmark.uri;
      this.iconPath = vscode.ThemeIcon.File;
      this.id = bookmark.path;
      this.contextValue = "BookmarkNodeFile";
    } else {
      this.iconPath = {
        light: context.asAbsolutePath("images/bookmark.svg"),
        dark: context.asAbsolutePath("images/bookmark.svg")
      };
      this.contextValue = "BookmarkNodeBookmark";
    }
  }
}