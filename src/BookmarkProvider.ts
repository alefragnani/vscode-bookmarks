import * as vscode from "vscode";
import { Bookmark } from "./Bookmark";
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

  private tree: BookmarkNode[] = [];

  constructor(private bookmarks: Bookmarks, ctx: vscode.ExtensionContext) {
    context = ctx;

    bookmarks.onDidClearBookmark( bkm => {

      // // no bookmark in this file
      // if (this.tree.length === 0) {
      //   this._onDidChangeTreeData.fire();
      //   return;
      // } 

      // // has bookmarks - find it
      // for (let index = 0; index < this.tree.length; index++) {
      //   let element = this.tree[index];
      //   if (element.bookmark === bkm) {
      //     this.tree.splice(index, 1);
      //     return;
      //   }
      // }
      // this.refresh(); // 
      this._onDidChangeTreeData.fire();
    });

    bookmarks.onDidClearAllBookmarks( bkm => {
      this._onDidChangeTreeData.fire();
    });

    bookmarks.onDidAddBookmark( bkm => {

      // no bookmark in this file
      if (this.tree.length === 0) {
        this._onDidChangeTreeData.fire();
        return;
      } 
      
      // has bookmarks - find it
      for (let bn of this.tree) {
        if (bn.bookmark === bkm.bookmark) {
          
          bn.books.push({
            file: bn.books[0].file,
            line: bkm.line,
            preview: bkm.line + ": " + bkm.preview
          });

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
        if (bn.bookmark === bkm.bookmark) {
          
          bn.books[bkm.index].line = bkm.line;
          bn.books[bkm.index].preview = bkm.line.toString() + ': ' + bkm.preview;
          
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
    for (let elem of this.bookmarks.bookmarks) {
      totalBookmarkCount = totalBookmarkCount + elem.bookmarks.length;
    }

    if (totalBookmarkCount === 0) {
      // vscode.window.showInformationMessage("No Bookmarks in this project.");
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
              arguments: [bbb.file, bbb.line],
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
              // if (this.bookmarks.bookmarks.length > 0) {
              if (bb.bookmarks.length > 0) {

                let books: BookmarkPreview[] = [];

                // search from `values`
                for (let element of values) {
                  if (element) {
                    for (let elementInside of element) {

                      if (bb.fsPath === elementInside.detail) {
                        books.push(
                          {
                            file: elementInside.detail,
                            line: parseInt(elementInside.label, 10),
                            preview: elementInside.label + ": " + elementInside.description
                          }
                          );
                      }
                    }
                  }
                }

                let itemPath = removeBasePathFrom(bb.fsPath);
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
      return inWorkspace.name + "\\" + aPath.split(inWorkspace.uri.fsPath).pop().substr(1);
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
    public readonly bookmark: Bookmark,
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
      this.contextValue = "BookmarkNodeFile";
    } else {
      this.iconPath = {
        light: context.asAbsolutePath("images/bookmark.svg"),
        dark: context.asAbsolutePath("images/bookmark.svg")
      }; 
      this.contextValue = "BookmarkNodeBookmark";
    }
  }

  // contextValue = "BookmarkNode";

}