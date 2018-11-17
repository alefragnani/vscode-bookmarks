// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import fs = require("fs");
import path = require("path");

import { JUMP_BACKWARD, JUMP_DIRECTION, JUMP_FORWARD, NO_BOOKMARKS, NO_MORE_BOOKMARKS, BookmarkedFile, Bookmark } from "./Bookmark";
import { BookmarksController } from "./Bookmarks";
import { BookmarkProvider } from "./BookmarkProvider";
import { Sticky } from "./Sticky";
import { Selection } from "./Selection";
import { Parser, Point } from "./Parser";

/**
 * Define the Bookmark Decoration
 */
function createTextEditorDecoration(context: vscode.ExtensionContext) {

    let pathIcon: string = vscode.workspace.getConfiguration("bookmarks").get("gutterIconPath", "");
    if (pathIcon !== "") {
        if (!fs.existsSync(pathIcon)) {
            vscode.window.showErrorMessage('The file "' + pathIcon + '" used for "bookmarks.gutterIconPath" does not exists.');
            pathIcon = context.asAbsolutePath("images/bookmark.svg");
        }
    } else {
        pathIcon = context.asAbsolutePath("images/bookmark.svg");
    }
    
    let backgroundColor: string = vscode.workspace.getConfiguration("bookmarks").get("backgroundLineColor", "");

    const decorationOptions: vscode.DecorationRenderOptions = {
        gutterIconPath: pathIcon,
        overviewRulerLane: vscode.OverviewRulerLane.Full,
        overviewRulerColor: "rgba(21, 126, 251, 0.7)"
    }

    if (backgroundColor) {
        decorationOptions.backgroundColor = backgroundColor;
        decorationOptions.isWholeLine = true;
    }

    return vscode.window.createTextEditorDecorationType(decorationOptions);
}

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
  
    let bookmarks: BookmarksController;
    let activeEditorCountLine: number;
    let timeout: NodeJS.Timer;

    // load pre-saved bookmarks
    let didLoadBookmarks: boolean = loadWorkspaceState();

    // tree-view
    const bookmarkProvider = new BookmarkProvider(bookmarks, context);
    vscode.window.registerTreeDataProvider("bookmarksExplorer", bookmarkProvider);
    bookmarkProvider.showTreeView();
	
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(cfg => {
        if (cfg.affectsConfiguration("bookmarks.treeview.visible")) {
            refreshTreeViewOnChangeConfiguration();
        }

        // Allow change the gutterIcon or backgroundLineColor without reload
        if (cfg.affectsConfiguration("bookmarks.gutterIconPath") || cfg.affectsConfiguration("bookmarks.backgroundLineColor")) {
            if (bookmarkDecorationType) {
                bookmarkDecorationType.dispose();
            }

            bookmarkDecorationType = createTextEditorDecoration(context);
            context.subscriptions.push(bookmarkDecorationType);

            updateDecorations();
        }
     }));

    function refreshTreeViewOnChangeConfiguration() {
        bookmarkProvider.showTreeView();
    }

    let bookmarkDecorationType = createTextEditorDecoration(context);
    context.subscriptions.push(bookmarkDecorationType);

    // Connect it to the Editors Events
    let activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
        if (!didLoadBookmarks) {
            bookmarks.add(activeEditor.document.uri.fsPath);
        }
        activeEditorCountLine = activeEditor.document.lineCount;
        bookmarks.activeBookmark = bookmarks.fromUri(activeEditor.document.uri.fsPath);
        triggerUpdateDecorations();
    }
	
    // new docs
    vscode.workspace.onDidOpenTextDocument(doc => {
        bookmarks.add(doc.uri.fsPath);
    });

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            activeEditorCountLine = editor.document.lineCount;
            bookmarks.activeBookmark = bookmarks.fromUri(editor.document.uri.fsPath);
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
//            triggerUpdateDecorations();
            let updatedBookmark: boolean = true;
			// call sticky function when the activeEditor is changed
            if (bookmarks.activeBookmark && bookmarks.activeBookmark.bookmarks.length > 0) {
                updatedBookmark = Sticky.stickyBookmarks(event, activeEditorCountLine, bookmarks.activeBookmark,
                activeEditor, bookmarks);
            }
			
            activeEditorCountLine = event.document.lineCount;
            updateDecorations();

            if (updatedBookmark) {
                saveWorkspaceState();
            }
        }
    }, null, context.subscriptions);

    // Timeout
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(updateDecorations, 100);
    }
	
    // Evaluate (prepare the list) and DRAW
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }

        if (!bookmarks.activeBookmark) {
            return;
        }

        if (bookmarks.activeBookmark.bookmarks.length === 0) {
            let books: vscode.Range[] = [];
          
            activeEditor.setDecorations(bookmarkDecorationType, books);
            return;
        }

        let books: vscode.Range[] = [];

		// Remove all bookmarks if active file is empty
        if (activeEditor.document.lineCount === 1 && activeEditor.document.lineAt(0).text === "") {
            bookmarks.activeBookmark.bookmarks = [];
        } else {
            let invalids = [];
            for (let element of bookmarks.activeBookmark.bookmarks) {

                if (element.line <= activeEditor.document.lineCount) { 
                    let decoration = new vscode.Range(element.line, 0, element.line, 0);
                    books.push(decoration);
                } else {
                    invalids.push(element);
                }
            }

            if (invalids.length > 0) {
                let idxInvalid: number;
                for (const element of invalids) {
                    idxInvalid = bookmarks.activeBookmark.indexOfBookmark(element);// bookmarks.indexOf(element); 
                    bookmarks.activeBookmark.bookmarks.splice(idxInvalid, 1);
                }
            }
        }
        activeEditor.setDecorations(bookmarkDecorationType, books);
    }

    vscode.commands.registerCommand("bookmarks.jumpTo", (documentPath, line, column: string) => {
        let uriDocBookmark: vscode.Uri = vscode.Uri.file(documentPath);
        vscode.workspace.openTextDocument(uriDocBookmark).then(doc => {
            vscode.window.showTextDocument(doc ).then(editor => {
                let lineInt: number = parseInt(line, 10);
                let colunnInt: number = parseInt(column, 10);
                // revealLine(lineInt - 1);
                revealPosition(lineInt - 1, colunnInt - 1);
            });
        });
    });

    vscode.commands.registerCommand("bookmarks.refresh", node => {
        bookmarkProvider.refresh();
    });

    vscode.commands.registerCommand("bookmarks.clearFromFile", node => {
        bookmarks.clear(node.bookmark);
        saveWorkspaceState();
        updateDecorations();
    });

    vscode.commands.registerCommand("bookmarks.deleteBookmark", node => {
        let book: BookmarkedFile = bookmarks.fromUri(node.command.arguments[0]);
        let index = book.indexOfBookmark(node.command.arguments[1] - 1);//bookmarks.indexOf({line: node.command.arguments[1] - 1});
        bookmarks.removeBookmark(index, node.command.arguments[1] - 1, book);
        saveWorkspaceState();
        updateDecorations();
    });

    vscode.commands.registerCommand("bookmarks.clear", () => clear());
    vscode.commands.registerCommand("bookmarks.clearFromAllFiles", () => clearFromAllFiles());
    vscode.commands.registerCommand("bookmarks.selectLines", () => selectLines());
    vscode.commands.registerCommand("bookmarks.expandSelectionToNext", () => expandSelectionToNextBookmark(JUMP_FORWARD));
    vscode.commands.registerCommand("bookmarks.expandSelectionToPrevious", () => expandSelectionToNextBookmark(JUMP_BACKWARD));
    vscode.commands.registerCommand("bookmarks.shrinkSelection", () => shrinkSelection());
    vscode.commands.registerCommand("bookmarks.toggle", () => toggle());
    vscode.commands.registerCommand("bookmarks.toggleLabeled", () => toggleLabeled());    
    vscode.commands.registerCommand("bookmarks.jumpToNext", () => jumpToNext());
    vscode.commands.registerCommand("bookmarks.jumpToPrevious", () => jumpToPrevious());
    vscode.commands.registerCommand("bookmarks.list", () => list());
    vscode.commands.registerCommand("bookmarks.listFromAllFiles", () => listFromAllFiles());
    


    function revealLine(line: number) {
        let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
        if (line === vscode.window.activeTextEditor.selection.active.line) {
            reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
        }
        let newSe = new vscode.Selection(line, 0, line, 0);
        vscode.window.activeTextEditor.selection = newSe;
        vscode.window.activeTextEditor.revealRange(newSe, reviewType);
    }

    function revealPosition(line, column: number) {

        if (column === NaN) {
            revealLine(line);
        } else {
            let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
            if (line === vscode.window.activeTextEditor.selection.active.line) {
                reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
            }
            let newSe = new vscode.Selection(line, column, line, column);
            vscode.window.activeTextEditor.selection = newSe;
            vscode.window.activeTextEditor.revealRange(newSe, reviewType);
        }
    }

    function canSaveBookmarksInProject(): boolean {
        let saveBookmarksInProject: boolean = vscode.workspace.getConfiguration("bookmarks").get("saveBookmarksInProject", false);
        
        // really use saveBookmarksInProject
        // 0. has at least a folder opened
        // 1. is a valid workspace/folder
        // 2. has only one workspaceFolder
        // let hasBookmarksFile: boolean = false;
        if (saveBookmarksInProject && ((!vscode.workspace.workspaceFolders) || (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 1))) {
            // hasBookmarksFile = fs.existsSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, ".vscode", "bookmarks.json"));
            saveBookmarksInProject = false;
        }

        return saveBookmarksInProject;
    }

    function loadWorkspaceState(): boolean {
        let saveBookmarksInProject: boolean = canSaveBookmarksInProject();

        bookmarks = new BookmarksController("");

        if (saveBookmarksInProject) {
            if (!vscode.workspace.workspaceFolders) {
                return false;
            }

            let bookmarksFileInProject: string = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, ".vscode", "bookmarks.json");
            if (!fs.existsSync(bookmarksFileInProject)) {
                return false;
            }
            try {
                bookmarks.loadFrom(JSON.parse(fs.readFileSync(bookmarksFileInProject).toString()), true);
                return true;
            } catch (error) {
                vscode.window.showErrorMessage("Error loading Bookmarks: " + error.toString());
                return false;
            }
        } else {
            let savedBookmarks = context.workspaceState.get("bookmarks", "");
            if (savedBookmarks !== "") {
                bookmarks.loadFrom(JSON.parse(savedBookmarks));
            }
            return savedBookmarks !== "";
        }        
    }

    function saveWorkspaceState(): void {
        let saveBookmarksInProject: boolean = canSaveBookmarksInProject();
        // return;
        if (saveBookmarksInProject) {
            let bookmarksFileInProject: string = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, ".vscode", "bookmarks.json");

            // avoid empty bookmarks.json file
            if (!bookmarks.hasAnyBookmark()) {
                if (fs.existsSync(bookmarksFileInProject)) {
                    fs.unlinkSync(bookmarksFileInProject);
                }
                return;
            }

            if (!fs.existsSync(path.dirname(bookmarksFileInProject))) {
                fs.mkdirSync(path.dirname(bookmarksFileInProject)); 
            }
            fs.writeFileSync(bookmarksFileInProject, JSON.stringify(bookmarks.zip(true), null, "\t"));   
        } else {
            context.workspaceState.update("bookmarks", JSON.stringify(bookmarks.zip()));
        }
    }

    function removeBasePathFrom(aPath: string, currentWorkspaceFolder: vscode.WorkspaceFolder): string {
        if (!vscode.workspace.workspaceFolders) {
            return aPath;
        }
        
        let inWorkspace: vscode.WorkspaceFolder;
        for (const wf of vscode.workspace.workspaceFolders) {
            if (aPath.indexOf(wf.uri.fsPath) === 0) {
                inWorkspace = wf;
            }
        }

        if (inWorkspace) {
            if (inWorkspace === currentWorkspaceFolder) {
                return aPath.split(inWorkspace.uri.fsPath).pop();
            } else {
                if (!currentWorkspaceFolder && vscode.workspace.workspaceFolders.length === 1) {
                    return aPath.split(inWorkspace.uri.fsPath).pop();
                } else {
                    return "$(file-submodule) " + inWorkspace.name + /*path.sep + */aPath.split(inWorkspace.uri.fsPath).pop();
                }
            }
            // const base: string = inWorkspace.name ? inWorkspace.name : inWorkspace.uri.fsPath;
            // return path.join(base, aPath.split(inWorkspace.uri.fsPath).pop());
            // return aPath.split(inWorkspace.uri.fsPath).pop();
        } else {
            return "$(file-directory) " + aPath;
        }
    }


    //
    function list() {
        
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to list bookmarks");
          return;
        }
        
        // no active bookmark
        if (!bookmarks.activeBookmark) {
            vscode.window.showInformationMessage("No Bookmark found");
            return;  
        }
      
        // no bookmark
        if (bookmarks.activeBookmark.bookmarks.length === 0) {
            vscode.window.showInformationMessage("No Bookmark found");
            return;
        }

        // push the items
        let items: vscode.QuickPickItem[] = [];
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < bookmarks.activeBookmark.bookmarks.length; index++) {

            let bookmarkLine = bookmarks.activeBookmark.bookmarks[index].line + 1;
            let bookmarkColumn = bookmarks.activeBookmark.bookmarks[index].column + 1;
            let lineText = vscode.window.activeTextEditor.document.lineAt(bookmarkLine - 1).text.trim();

            if (bookmarks.activeBookmark.bookmarks[index].label === "") {
                items.push({ description: "(Ln " + bookmarkLine.toString() + ", Col " + 
                    bookmarkColumn.toString() + ")", label: lineText });
            } else {
                items.push({ description: "(Ln " + bookmarkLine.toString() + ", Col " + 
                bookmarkColumn.toString() + ")", 
                label: "$(tag) " + bookmarks.activeBookmark.bookmarks[index].label });
            }
        }
		
        // pick one
        let currentLine: number = vscode.window.activeTextEditor.selection.active.line + 1;
        let options = <vscode.QuickPickOptions> {
            placeHolder: "Type a line number or a piece of code to navigate to",
            matchOnDescription: true,
            // matchOnDetail: true,
            onDidSelectItem: item => {
                const itemT = <vscode.QuickPickItem> item;
                const point: Point = Parser.parsePosition(itemT.description);
                if (point) {
                    revealPosition(point.line - 1, point.column - 1);
                }
            }
        };

        vscode.window.showQuickPick(items, options).then(selection => {
            if (typeof selection === "undefined") {
                revealLine(currentLine - 1);
                return;
            }
            const itemT = <vscode.QuickPickItem> selection;
            const point: Point = Parser.parsePosition(itemT.description);
            if (point) {
                revealPosition(point.line - 1, point.column - 1);
            }
    });
    };

    function clear() {
        
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to clear bookmarks");
          return;
        }      
      
        bookmarks.clear();
        saveWorkspaceState();
        updateDecorations();
    };

    function clearFromAllFiles() {
        bookmarks.clearAll();
        saveWorkspaceState();
        updateDecorations();
    };

    function selectLines() {
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to clear bookmarks");
          return;
        }
        
        if (bookmarks.activeBookmark.bookmarks.length === 0) {
          vscode.window.showInformationMessage("No Bookmark found");
          return;
        }      

        let lines: number[] = [];
        for (const bookmark of bookmarks.activeBookmark.bookmarks) {
            lines.push(bookmark.line);
        }
        Selection.selectLines(vscode.window.activeTextEditor, lines);
    };   

    function shrinkSelection() {
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to shrink bookmark selection");
          return;
        }
        
        if (vscode.window.activeTextEditor.selections.length > 1) {
          vscode.window.showInformationMessage("Command not supported with more than one selection");
          return;
        }
        
        if (vscode.window.activeTextEditor.selection.isEmpty) {
          vscode.window.showInformationMessage("No selection found");
          return;
        }              
        
        if (bookmarks.activeBookmark.bookmarks.length === 0) {
          vscode.window.showInformationMessage("No Bookmark found");
          return;
        }      
      
        // which direction?
        let direction: JUMP_DIRECTION = vscode.window.activeTextEditor.selection.isReversed ? JUMP_FORWARD : JUMP_BACKWARD;
        let activeSelectionStartLine: number = vscode.window.activeTextEditor.selection.isReversed ? vscode.window.activeTextEditor.selection.end.line : vscode.window.activeTextEditor.selection.start.line; 

        let currPosition: vscode.Position;
        if (direction === JUMP_FORWARD) {
            currPosition = vscode.window.activeTextEditor.selection.start;
        } else {
            currPosition = vscode.window.activeTextEditor.selection.end;
        }
    
        bookmarks.activeBookmark.nextBookmark(currPosition, direction)
            .then((next) => {
              if (typeof next === "number") {
                    vscode.window.setStatusBarMessage("No more bookmarks", 2000);
                    return;
              } else {
                   
                  if ((direction === JUMP_BACKWARD && next.line < activeSelectionStartLine) || 
                    (direction === JUMP_FORWARD && next.line > activeSelectionStartLine)) {
                      vscode.window.setStatusBarMessage("No more bookmarks to shrink", 2000);
                  } else {                  
                    Selection.shrinkRange(vscode.window.activeTextEditor, next, direction);
                  }
              }
            })
            .catch((error) => {
              console.log("activeBookmark.nextBookmark REJECT" + error);
            });        
    }
    
    function expandSelectionToNextBookmark(direction: JUMP_DIRECTION) {
        if (!vscode.window.activeTextEditor) {
            vscode.window.showInformationMessage("Open a file first to clear bookmarks");
            return;
        }

        if (bookmarks.activeBookmark.bookmarks.length === 0) {
            vscode.window.showInformationMessage("No Bookmark found");
            return;
        }

        if (bookmarks.activeBookmark.bookmarks.length === 1) {
            vscode.window.showInformationMessage("There is only one bookmark in this file");
            return;
        }

        let currPosition: vscode.Position;
        if (vscode.window.activeTextEditor.selection.isEmpty) {
            currPosition = vscode.window.activeTextEditor.selection.active;
        } else {
            if (direction === JUMP_FORWARD) {
                currPosition = vscode.window.activeTextEditor.selection.end;
            } else {
                currPosition = vscode.window.activeTextEditor.selection.start;
            }
        }

        bookmarks.activeBookmark.nextBookmark(currPosition, direction)
            .then((next) => {
                if (typeof next === "number") {
                    vscode.window.setStatusBarMessage("No more bookmarks", 2000);
                    return;
                } else {
                    Selection.expandRange(vscode.window.activeTextEditor, next, direction);
                }
            })
            .catch((error) => {
                console.log("activeBookmark.nextBookmark REJECT" + error);
            });
    };

    function listFromAllFiles() {

        // no bookmark
        if (!bookmarks.hasAnyBookmark()) {
            vscode.window.showInformationMessage("No Bookmarks found");
            return;
        }

        // push the items
        let items: vscode.QuickPickItem[] = [];
        let activeTextEditorPath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri.fsPath : "";
        let promisses = [];
        let currentLine: number = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.selection.active.line + 1 : -1;
        
        let currentWorkspaceFolder: vscode.WorkspaceFolder; 
        if (activeTextEditorPath) {
            currentWorkspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(activeTextEditorPath));
        }            
        
        // for (let index = 0; index < bookmarks.bookmarks.length; index++) {
        for (let bookmark of bookmarks.storage.fileList) {
            let pp = bookmark.listBookmarks();
            promisses.push(pp);
        }
        
        Promise.all(promisses).then(
          (values) => {
              
              for (let element of values) {
                  if (element) {
                    for (let elementInside of element) {
                        if (elementInside.detail.toString().toLowerCase() === activeTextEditorPath.toLowerCase()) {
                            items.push(
                                {
                                    label: elementInside.label,
                                    description: elementInside.description
                                }
                            );
                        } else {
                            let itemPath = removeBasePathFrom(elementInside.detail, currentWorkspaceFolder);
                            items.push(
                                {
                                    label: elementInside.label,
                                    description: elementInside.description,
                                    detail: itemPath
                                }
                            );
                        }
                    }

                  }

              }

              // sort
              // - active document
              // - no octicon - document in same workspaceFolder
              // - with octicon 'file-submodules' - document in another workspaceFolder
              // - with octicon - 'file-directory' - document outside any workspaceFolder
              let itemsSorted: vscode.QuickPickItem[];
              itemsSorted = items.sort(function (a: vscode.QuickPickItem, b: vscode.QuickPickItem): number {
                if (!a.detail && !b.detail) {
                    return 0;
                }
                
                if (!a.detail && b.detail) {
                    return -1;
                }
                
                if (a.detail && !b.detail) {
                    return 1;
                }
                
                if ((a.detail.toString().indexOf("$(file-submodule) ") === 0) && (b.detail.toString().indexOf("$(file-directory) ") === 0)) {
                    return -1;
                };
                
                if ((a.detail.toString().indexOf("$(file-directory) ") === 0) && (b.detail.toString().indexOf("$(file-submodule) ") === 0)) {
                    return 1;
                };
                
                if ((a.detail.toString().indexOf("$(file-submodule) ") === 0) && (b.detail.toString().indexOf("$(file-submodule) ") === -1)) {
                    return 1;
                };
                
                if ((a.detail.toString().indexOf("$(file-submodule) ") === -1) && (b.detail.toString().indexOf("$(file-submodule) ") === 0)) {
                    return -1;
                };
                
                if ((a.detail.toString().indexOf("$(file-directory) ") === 0) && (b.detail.toString().indexOf("$(file-directory) ") === -1)) {
                    return 1;
                };
                
                if ((a.detail.toString().indexOf("$(file-directory) ") === -1) && (b.detail.toString().indexOf("$(file-directory) ") === 0)) {
                    return -1;
                };
                
                return 0;
              });

              let options = <vscode.QuickPickOptions> {
                  placeHolder: "Type a line number or a piece of code to navigate to",
                  matchOnDescription: true,
                  onDidSelectItem: item => {

                      let itemT = <vscode.QuickPickItem>item;

                      let filePath: string;
                      // no detail - previously active document
                      if (!itemT.detail) {
                          filePath = activeTextEditorPath;
                      } else {
                          // with octicon - document outside project
                          if (itemT.detail.toString().indexOf("$(file-directory) ") === 0) {
                              filePath = itemT.detail.toString().split("$(file-directory) ").pop();
                          } else { // with octicon - documento from other workspaceFolder
                            if (itemT.detail.toString().indexOf("$(file-submodule)") === 0) {
                                filePath = itemT.detail.toString().split("$(file-submodule) ").pop();
                                for (const wf of vscode.workspace.workspaceFolders) {
                                    if (wf.name === filePath.split(path.sep).shift()) {
                                        filePath = path.join(wf.uri.fsPath, filePath.split(path.sep).slice(1).join(path.sep));
                                        break;
                                    }
                                }
                                
                            } else { // no octicon - document inside project
                                if (currentWorkspaceFolder) {
                                    filePath = currentWorkspaceFolder.uri.fsPath + itemT.detail.toString();
                                } else {
                                    if (vscode.workspace.workspaceFolders) {
                                        filePath = vscode.workspace.workspaceFolders[0].uri.fsPath + itemT.detail.toString();
                                    } else {
                                        filePath = itemT.detail.toString();
                                    }
                                }
                            }
                          }
                      }

                      const point: Point = Parser.parsePosition(itemT.description);
                      if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri.fsPath.toLowerCase() === filePath.toLowerCase()) {
                        if (point) {
                            revealPosition(point.line - 1, point.column - 1);
                        }
                      } else {
                          let uriDocument: vscode.Uri = vscode.Uri.file(filePath);
                          vscode.workspace.openTextDocument(uriDocument).then(doc => {
                              vscode.window.showTextDocument(doc, { preserveFocus: true, preview: true }).then(editor => {
                                if (point) {
                                    revealPosition(point.line - 1, point.column - 1);
                                }
                              });
                          });
                      }
                  }
              };
              vscode.window.showQuickPick(itemsSorted, options).then(selection => {
                  if (typeof selection === "undefined") {
                      if (activeTextEditorPath === "")  {
                          return;
                      } else {
                        let uriDocument: vscode.Uri = vscode.Uri.file(activeTextEditorPath);
                        vscode.workspace.openTextDocument(uriDocument).then(doc => {
                            vscode.window.showTextDocument(doc).then(editor => {
                                revealLine(currentLine - 1);
                                return;
                            });
                        });                          
                      }
                  }
                  
                  if (typeof selection === "undefined") {
                      return;
                  }

                  const point: Point = Parser.parsePosition(selection.description);
                  if (!selection.detail) {
                    if (point) {
                        revealPosition(point.line - 1, point.column - 1);
                    }
                  } else {
                      let newPath: string;
                      // with octicon - document outside project
                      if (selection.detail.toString().indexOf("$(file-directory) ") === 0) {
                          newPath = selection.detail.toString().split("$(file-directory) ").pop();
                      } else {// no octicon - document inside project
                        if (selection.detail.toString().indexOf("$(file-submodule)") === 0) {
                            newPath = selection.detail.toString().split("$(file-submodule) ").pop();
                            for (const wf of vscode.workspace.workspaceFolders) {
                                if (wf.name === newPath.split(path.sep).shift()) {
                                    newPath = path.join(wf.uri.fsPath, newPath.split(path.sep).slice(1).join(path.sep));
                                    break;
                                }
                            }                            
                        } else { // no octicon - document inside project
                            if (currentWorkspaceFolder) {
                                newPath = currentWorkspaceFolder.uri.fsPath + selection.detail.toString();
                            } else {
                                if (vscode.workspace.workspaceFolders) {
                                    newPath = vscode.workspace.workspaceFolders[0].uri.fsPath + selection.detail.toString();
                                } else {
                                    newPath = selection.detail.toString();
                                }
                            }
                        }
                      }
                      let uriDocument: vscode.Uri = vscode.Uri.file(newPath);
                      vscode.workspace.openTextDocument(uriDocument).then(doc => {
                          vscode.window.showTextDocument(doc).then(editor => {
                            if (point) {
                                revealPosition(point.line - 1, point.column - 1);
                            }        
                          });
                      });
                  }
              });
            }  
        );
    };

    function jumpToNext() {
        
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to jump to bookmarks");
          return;
        }
        
        if (!bookmarks.activeBookmark) {
            return;
        }      
        
        // 
        bookmarks.activeBookmark.nextBookmark(vscode.window.activeTextEditor.selection.active)
            .then((next) => {
              if (typeof next === "number") {
                bookmarks.nextDocumentWithBookmarks(bookmarks.activeBookmark)
                  .then((nextDocument) => {
                      
                      if (nextDocument === NO_MORE_BOOKMARKS) {
                          return;
                      }
                    
                      // same document?
                      let activeDocument = BookmarksController.normalize(vscode.window.activeTextEditor.document.uri.fsPath);
                      if (nextDocument.toString() === activeDocument) {
                        revealPosition(bookmarks.activeBookmark.bookmarks[0].line, 
                            bookmarks.activeBookmark.bookmarks[0].column);
                      } else { 
                        vscode.workspace.openTextDocument(nextDocument.toString()).then(doc => {
                            vscode.window.showTextDocument(doc).then(editor => {
                                revealPosition(bookmarks.activeBookmark.bookmarks[0].line, 
                                    bookmarks.activeBookmark.bookmarks[0].column);
                            });
                        });
                      }
                  })
                  .catch((error) => {
                      vscode.window.showInformationMessage("No more bookmarks...");
                  });
              } else {
                  revealPosition(next.line, next.character);
              }
            })
            .catch((error) => {
              console.log("activeBookmark.nextBookmark REJECT" + error);
            });
    };

    function jumpToPrevious() {
      
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to jump to bookmarks");
          return;
        }
      
        if (!bookmarks.activeBookmark) {
            return;
        }      
        
        // 
        bookmarks.activeBookmark.nextBookmark(vscode.window.activeTextEditor.selection.active, JUMP_BACKWARD)
            .then((next) => {
                if (typeof next === "number") {
                bookmarks.nextDocumentWithBookmarks(bookmarks.activeBookmark, JUMP_BACKWARD)
                  .then((nextDocument) => {
                      
                      if (nextDocument === NO_MORE_BOOKMARKS) {
                          return;
                      }
                    
                      // same document?
                      let activeDocument = BookmarksController.normalize(vscode.window.activeTextEditor.document.uri.fsPath);
                      if (nextDocument.toString() === activeDocument) {
                        revealPosition(bookmarks.activeBookmark.bookmarks[bookmarks.activeBookmark.bookmarks.length - 1].line, 
                            bookmarks.activeBookmark.bookmarks[bookmarks.activeBookmark.bookmarks.length - 1].column);
                      } else { 
                        vscode.workspace.openTextDocument(nextDocument.toString()).then(doc => {
                            vscode.window.showTextDocument(doc).then(editor => {
                                revealPosition(bookmarks.activeBookmark.bookmarks[bookmarks.activeBookmark.bookmarks.length - 1].line, 
                                    bookmarks.activeBookmark.bookmarks[bookmarks.activeBookmark.bookmarks.length - 1].column);
                            });
                        });
                      }
                  })
                  .catch((error) => {
                      vscode.window.showInformationMessage("No more bookmarks...");
                  });
              } else {
                  revealPosition(next.line, next.character);
              }
            })
            .catch((error) => {
              console.log("activeBookmark.nextBookmark REJECT" + error);
            });
    };

    function askForBookmarkLabel(index: number, position: vscode.Position, oldLabel?: string) {
        const ibo = <vscode.InputBoxOptions>{
            prompt: "Bookmark Label",
            placeHolder: "Type a label for your bookmark",
            value: oldLabel
        };
        vscode.window.showInputBox(ibo).then(bookmarkLabel => {
            if (typeof bookmarkLabel === "undefined") {
                return;
            }
            // 'empty'
            if (bookmarkLabel === "") {
                vscode.window.showWarningMessage("You must define a label for the bookmark.");
                return;
            }
            if (index >= 0) {
                bookmarks.removeBookmark(index, position.line);
            }
            bookmarks.addBookmark(position, bookmarkLabel);
            
            // toggle editing mode
            vscode.window.showTextDocument(vscode.window.activeTextEditor.document, { preview: false, viewColumn: vscode.window.activeTextEditor.viewColumn });
            // sorted
            /* let itemsSorted = [] =*/
            bookmarks.activeBookmark.bookmarks.sort((n1, n2) => {
                if (n1.line > n2.line) {
                    return 1;
                }
                if (n1.line < n2.line) {
                    return -1;
                }
                return 0;
            });
            saveWorkspaceState();
            updateDecorations();
        });
    }


    function toggle() {
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to toggle bookmarks");
          return;
        }         
      
        const position = vscode.window.activeTextEditor.selection.active;

        // fix issue emptyAtLaunch
        if (!bookmarks.activeBookmark) {
            bookmarks.add(vscode.window.activeTextEditor.document.uri.fsPath);
            bookmarks.activeBookmark = bookmarks.fromUri(vscode.window.activeTextEditor.document.uri.fsPath);
        }

        let index = bookmarks.activeBookmark.indexOfBookmark(position.line);
        if (index < 0) {
            bookmarks.addBookmark(position);            
            vscode.window.showTextDocument(vscode.window.activeTextEditor.document, {preview: false, viewColumn: vscode.window.activeTextEditor.viewColumn} );
        } else {
            bookmarks.removeBookmark(index, position.line);
        }		
		
        // sorted
        /* let itemsSorted = [] =*/
        bookmarks.activeBookmark.bookmarks.sort((n1, n2) => {
            if (n1.line > n2.line) {
                return 1;
            }

            if (n1.line < n2.line) {
                return -1;
            }

            return 0;
        });

        saveWorkspaceState();
        updateDecorations();
    };

    function toggleLabeled() {

        if (!vscode.window.activeTextEditor) {
            vscode.window.showInformationMessage("Open a file first to toggle bookmarks");
            return;
        }

        const position: vscode.Position = vscode.window.activeTextEditor.selection.active;

        // fix issue emptyAtLaunch
        if (!bookmarks.activeBookmark) {
            bookmarks.add(vscode.window.activeTextEditor.document.uri.fsPath);
            bookmarks.activeBookmark = bookmarks.fromUri(vscode.window.activeTextEditor.document.uri.fsPath);
        }

        let index = bookmarks.activeBookmark.indexOfBookmark(position.line);
        let oldLabel: string = index > -1 ? bookmarks.activeBookmark.bookmarks[index].label : "";
        if (index < 0) {
            askForBookmarkLabel(index, position);
        } else {
            askForBookmarkLabel(index, position, oldLabel);
        }
    };
}