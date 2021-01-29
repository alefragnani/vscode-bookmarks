/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import fs = require("fs");
import path = require("path");
import * as vscode from "vscode";
import { workspace } from "vscode";
import { codicons } from "vscode-ext-codicons";
import { NO_BOOKMARKS_AFTER, NO_BOOKMARKS_BEFORE, NO_MORE_BOOKMARKS } from "../vscode-bookmarks-core/src/api/constants";
import { Directions, isWindows, SEARCH_EDITOR_SCHEME } from "../vscode-bookmarks-core/src/api/constants";
import { Container } from "../vscode-bookmarks-core/src/container";
import { createTextEditorDecoration, updateDecorationsInActiveEditor } from "../vscode-bookmarks-core/src/decoration";
import { File } from "../vscode-bookmarks-core/src/file";
import { Controller } from "../vscode-bookmarks-core/src/model/controller";
import { indexOfBookmark, listBookmarks, nextBookmark, sortBookmarks } from "../vscode-bookmarks-core/src/model/operations";
import { loadBookmarks, saveBookmarks } from "../vscode-bookmarks-core/src/model/workspaceState";
import { expandSelectionToNextBookmark, selectBookmarkedLines, shrinkSelection } from "../vscode-bookmarks-core/src/selections";
import { BookmarksExplorer } from "../vscode-bookmarks-core/src/sidebar/bookmarkProvider";
import { parsePosition, Point } from "../vscode-bookmarks-core/src/sidebar/parser";
import { Sticky } from "../vscode-bookmarks-core/src/sticky/sticky";
import { suggestLabel, useSelectionWhenAvailable } from "../vscode-bookmarks-core/src/suggestion";
import { registerOpenSettings } from "./commands/openSettings";
import { registerSupportBookmarks } from "./commands/supportBookmarks";
import { registerHelpAndFeedbackView } from "./sidebar/helpAndFeedbackView";
import { registerWhatsNew } from "./whats-new/commands";

// this method is called when vs code is activated
export async function activate(context: vscode.ExtensionContext) {

    Container.context = context;
  
    let controller: Controller;// = new Controller();
    let activeEditorCountLine: number;
    let timeout: NodeJS.Timer;

    registerWhatsNew();
    
    context.subscriptions.push(vscode.commands.registerCommand("_bookmarks.openFolderWelcome", () => {
        const openFolderCommand = isWindows ? "workbench.action.files.openFolder" : "workbench.action.files.openFileFolder"
        vscode.commands.executeCommand(openFolderCommand)
    }));    
    
    // load pre-saved bookmarks
    // const didLoadBookmarks: boolean = loadWorkspaceState();
    let didLoadBookmarks: boolean;
    if (vscode.workspace.workspaceFolders) {
        didLoadBookmarks = await loadWorkspaceState(vscode.workspace.workspaceFolders[0]); // activeEditor.document.uri);
    } else {
        didLoadBookmarks = await loadWorkspaceState(undefined);
    }
    
    // tree-view
    // const bookmarkProvider = new BookmarkProvider(bookmarks, context);
    // vscode.window.registerTreeDataProvider("bookmarksExplorer", bookmarkProvider);
    
    const bookmarkExplorer = new BookmarksExplorer(controller, context);
    const bookmarkProvider = bookmarkExplorer.getProvider();
    
    registerOpenSettings();
    registerSupportBookmarks();
    registerHelpAndFeedbackView(context);
    // bookmarkProvider.showTreeView();

    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(cfg => {
        // Allow change the gutterIcon without reload
        if (cfg.affectsConfiguration("bookmarks.gutterIconPath")) {
            if (bookmarkDecorationType) {
                bookmarkDecorationType.dispose();
            }

            bookmarkDecorationType = createTextEditorDecoration(context);
            context.subscriptions.push(bookmarkDecorationType);

            updateDecorations();
        }
        
        if (cfg.affectsConfiguration("bookmarks.saveBookmarksInProject")) {
            saveWorkspaceState();
        }
    }));

    let bookmarkDecorationType = createTextEditorDecoration(context);
    context.subscriptions.push(bookmarkDecorationType);

    // Connect it to the Editors Events
    let activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
        if (!didLoadBookmarks) {
            controller.addFile(activeEditor.document.uri);
        }
        activeEditorCountLine = activeEditor.document.lineCount;
        controller.activeBookmark = controller.fromUri(activeEditor.document.uri);
        triggerUpdateDecorations();
    }

    // new docs
    vscode.workspace.onDidOpenTextDocument(doc => {
        controller.addFile(doc.uri);
    });

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            activeEditorCountLine = editor.document.lineCount;
            controller.activeBookmark = controller.fromUri(editor.document.uri);
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
//            triggerUpdateDecorations();
            let updatedBookmark = false;

            // workaround for formatters like Prettier (#118)
            if (vscode.workspace.getConfiguration("bookmarks").get("useWorkaroundForFormatters", false)) {
                updateDecorations();
                return;
            }

            // call sticky function when the activeEditor is changed
            if (controller.activeBookmark && controller.activeBookmark.bookmarks.length > 0) {
                updatedBookmark = Sticky.stickyBookmarks(event, activeEditorCountLine, controller.activeBookmark,
                activeEditor, controller);
            }

            activeEditorCountLine = event.document.lineCount;
            updateDecorations();

            if (updatedBookmark) {
                saveWorkspaceState();
            }
        }
    }, null, context.subscriptions);

    context.subscriptions.push(vscode.workspace.onDidRenameFiles(rename => {
        
        if (rename.files.length === 0) { return; } 
        
        rename.files.forEach(async file => {
            const files = controller.files.map(file => file.path);
            const stat = await vscode.workspace.fs.stat(file.newUri);
            
            if (stat.type === vscode.FileType.File) {
                if (files.includes(file.oldUri.fsPath)) {
                    controller.updateFilePath(file.oldUri.fsPath, file.newUri.fsPath);
                }
            }
            if (stat.type === vscode.FileType.Directory) {
                controller.updateDirectoryPath(file.oldUri.fsPath, file.newUri.fsPath);
            }
        });
        bookmarkProvider.refresh();
        saveWorkspaceState();
    }));

    // Timeout
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(updateDecorations, 100);
    }

    // Evaluate (prepare the list) and DRAW
    function updateDecorations() {
        updateDecorationsInActiveEditor(activeEditor, controller, bookmarkDecorationType);
    }

    vscode.commands.registerCommand("_bookmarks.jumpTo", (documentPath, line, column: string) => {
        const uriDocBookmark: vscode.Uri = vscode.Uri.file(documentPath);
        vscode.workspace.openTextDocument(uriDocBookmark).then(doc => {
            vscode.window.showTextDocument(doc ).then(() => {
                const lineInt: number = parseInt(line, 10);
                const colunnInt: number = parseInt(column, 10);
                // revealLine(lineInt - 1);
                revealPosition(lineInt - 1, colunnInt - 1);
            });
        });
    });

    vscode.commands.registerCommand("bookmarks.refresh", () => {
        bookmarkProvider.refresh();
    });

    vscode.commands.registerCommand("_bookmarks.clearFromFile", node => {
        controller.clear(node.bookmark);
        saveWorkspaceState();
        updateDecorations();
    });

    vscode.commands.registerCommand("_bookmarks.deleteBookmark", node => {
        const book: File = controller.fromUri(node.command.arguments[0]);
        const index = indexOfBookmark(book, node.command.arguments[1] - 1); // bookmarks.indexOf({line: node.command.arguments[1] - 1});
        controller.removeBookmark(index, node.command.arguments[1] - 1, book);
        saveWorkspaceState();
        updateDecorations();
    });

    vscode.commands.registerCommand("_bookmarks.editLabel", node => {
        const uriDocBookmark: vscode.Uri = vscode.Uri.file(node.command.arguments[0]);
        const book: File = controller.fromUri(uriDocBookmark);
        const index = indexOfBookmark(book, node.command.arguments[1] - 1);

        const position: vscode.Position = new vscode.Position(node.command.arguments[1] - 1, 
            node.command.arguments[2] - 1);
        // book.bookmarks[index].label = "novo label";
        askForBookmarkLabel(index, position, book.bookmarks[index].label, false, book);
    });

    vscode.commands.registerCommand("bookmarks.clear", () => clear());
    vscode.commands.registerCommand("bookmarks.clearFromAllFiles", () => clearFromAllFiles());
    vscode.commands.registerCommand("bookmarks.selectLines", () => selectBookmarkedLines(controller));
    vscode.commands.registerCommand("bookmarks.expandSelectionToNext", () => expandSelectionToNextBookmark(controller, Directions.Forward));
    vscode.commands.registerCommand("bookmarks.expandSelectionToPrevious", () => expandSelectionToNextBookmark(controller, Directions.Backward));
    vscode.commands.registerCommand("bookmarks.shrinkSelection", () => shrinkSelection(controller));
    vscode.commands.registerCommand("bookmarks.toggle", () => toggle());
    vscode.commands.registerCommand("bookmarks.toggleLabeled", () => toggleLabeled());    
    vscode.commands.registerCommand("bookmarks.jumpToNext", () => jumpToNext(Directions.Forward));
    vscode.commands.registerCommand("bookmarks.jumpToPrevious", () => jumpToNext(Directions.Backward));
    vscode.commands.registerCommand("bookmarks.list", () => list());
    vscode.commands.registerCommand("bookmarks.listFromAllFiles", () => listFromAllFiles());
    
    function revealLine(line: number) {
        let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
        if (line === vscode.window.activeTextEditor.selection.active.line) {
            reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
        }
        const newSe = new vscode.Selection(line, 0, line, 0);
        vscode.window.activeTextEditor.selection = newSe;
        vscode.window.activeTextEditor.revealRange(newSe, reviewType);
    }

    function revealPosition(line, column: number) {

        if (isNaN(column)) {
            revealLine(line);
        } else {
            let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
            if (line === vscode.window.activeTextEditor.selection.active.line) {
                reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
            }
            const newSe = new vscode.Selection(line, column, line, column);
            vscode.window.activeTextEditor.selection = newSe;
            vscode.window.activeTextEditor.revealRange(newSe, reviewType);
        }
    }

    function canSaveBookmarksInProject(): boolean {
        let saveBookmarksInProject: boolean = workspace.getConfiguration("bookmarks").get("saveBookmarksInProject", false);
        
        // really use saveBookmarksInProject
        // 0. has at least a folder opened
        // 1. is a valid workspace/folder
        // 2. has only one workspaceFolder
        // let hasBookmarksFile: boolean = false;
        if (saveBookmarksInProject && ((!workspace.workspaceFolders) || (workspace.workspaceFolders && workspace.workspaceFolders.length > 1))) {
            // hasBookmarksFile = fs.existsSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, ".vscode", "bookmarks.json"));
            saveBookmarksInProject = false;
        }
    
        return saveBookmarksInProject;
    }

    async function loadWorkspaceState(workspaceFolder: vscode.WorkspaceFolder): Promise<boolean> {
        const saveBookmarksInProject: boolean = canSaveBookmarksInProject();

        controller = new Controller(workspaceFolder); 

        if (saveBookmarksInProject) {
            const bookmarksFileInProject: string = path.join(workspaceFolder.uri.fsPath, ".vscode", "bookmarks.json");
            if (!fs.existsSync(bookmarksFileInProject)) {
                return false;
            }
            
            try {
                controller.loadFrom(JSON.parse(fs.readFileSync(bookmarksFileInProject).toString()), true);
                return true;
            } catch (error) {
                vscode.window.showErrorMessage("Error loading Bookmarks: " + error.toString());
                return false;
            }
        } else {
            const savedBookmarks = context.workspaceState.get("bookmarks", "");
            if (savedBookmarks !== "") {
                controller.loadFrom(JSON.parse(savedBookmarks));
            }
            return savedBookmarks !== "";
        }
    }

    function saveWorkspaceState(): void {
        // saveBookmarks(controller, context);
        const saveBookmarksInProject: boolean = canSaveBookmarksInProject();

        if (saveBookmarksInProject) {
            const bookmarksFileInProject: string = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, ".vscode", "bookmarks.json");
            if (!fs.existsSync(path.dirname(bookmarksFileInProject))) {
                fs.mkdirSync(path.dirname(bookmarksFileInProject));
            }
            fs.writeFileSync(bookmarksFileInProject, JSON.stringify(controller.zip(), null, "\t"));
        } else {
            context.workspaceState.update("bookmarks", JSON.stringify(controller.zip()));
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
                    return codicons.file_submodule + " " + inWorkspace.name + aPath.split(inWorkspace.uri.fsPath).pop();
                }
            }
            // const base: string = inWorkspace.name ? inWorkspace.name : inWorkspace.uri.fsPath;
            // return path.join(base, aPath.split(inWorkspace.uri.fsPath).pop());
            // return aPath.split(inWorkspace.uri.fsPath).pop();
        } else {
            return codicons.file_directory + " " + aPath;
        }
    }

    //
    function list() {
        
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to list bookmarks");
          return;
        }
        
        // no active bookmark
        if (!controller.activeBookmark) {
            vscode.window.showInformationMessage("No Bookmark found");
            return;  
        }
      
        // no bookmark
        if (controller.activeBookmark.bookmarks.length === 0) {
            vscode.window.showInformationMessage("No Bookmark found");
            return;
        }

        // push the items
        const items: vscode.QuickPickItem[] = [];
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < controller.activeBookmark.bookmarks.length; index++) {

            const bookmarkLine = controller.activeBookmark.bookmarks[index].line + 1;
            const bookmarkColumn = controller.activeBookmark.bookmarks[index].column + 1;
            const lineText = vscode.window.activeTextEditor.document.lineAt(bookmarkLine - 1).text.trim();

            if (controller.activeBookmark.bookmarks[index].label === "") {
                items.push({ description: "(Ln " + bookmarkLine.toString() + ", Col " + 
                    bookmarkColumn.toString() + ")", label: lineText });
            } else {
                items.push({ description: "(Ln " + bookmarkLine.toString() + ", Col " + 
                bookmarkColumn.toString() + ")", 
                label: codicons.tag + " " + controller.activeBookmark.bookmarks[index].label });
            }
        }

        // pick one
        const currentLine: number = vscode.window.activeTextEditor.selection.active.line + 1;
        const options = <vscode.QuickPickOptions> {
            placeHolder: "Type a line number or a piece of code to navigate to",
            matchOnDescription: true,
            // matchOnDetail: true,
            onDidSelectItem: item => {
                const itemT = <vscode.QuickPickItem> item;
                const point: Point = parsePosition(itemT.description);
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
            const point: Point = parsePosition(itemT.description);
            if (point) {
                revealPosition(point.line - 1, point.column - 1);
            }
    });
    }

    function clear() {
        
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to clear bookmarks");
          return;
        }      
      
        controller.clear();
        saveWorkspaceState();
        updateDecorations();
    }

    function clearFromAllFiles() {
        controller.clearAll();
        saveWorkspaceState();
        updateDecorations();
    }

    function listFromAllFiles() {

        // no bookmark
        if (!controller.hasAnyBookmark()) {
            vscode.window.showInformationMessage("No Bookmarks found");
            return;
        }

        // push the items
        const items: vscode.QuickPickItem[] = [];
        const activeTextEditorPath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri.fsPath : "";
        const promisses = [];
        const currentLine: number = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.selection.active.line + 1 : -1;
        
        let currentWorkspaceFolder: vscode.WorkspaceFolder; 
        if (activeTextEditorPath) {
            currentWorkspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(activeTextEditorPath));
        }            
        
        // for (let index = 0; index < bookmarks.bookmarks.length; index++) {
        for (const bookmark of controller.files) {
            const pp = listBookmarks(bookmark, controller.workspaceFolder);
            promisses.push(pp);
        }
        
        Promise.all(promisses).then(
          (values) => {
              
              for (const element of values) {
                  if (element) {
                    for (const elementInside of element) {
                        if (elementInside.detail.toString().toLowerCase() === activeTextEditorPath.toLowerCase()) {
                            items.push(
                                {
                                    label: elementInside.label,
                                    description: elementInside.description
                                }
                            );
                        } else {
                            const itemPath = removeBasePathFrom(elementInside.detail, currentWorkspaceFolder);
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
              const itemsSorted: vscode.QuickPickItem[] = items.sort(function(a: vscode.QuickPickItem, b: vscode.QuickPickItem): number {
                if (!a.detail && !b.detail) {
                    return 0;
                }
                
                if (!a.detail && b.detail) {
                    return -1;
                }
                
                if (a.detail && !b.detail) {
                    return 1;
                }
                
                if ((a.detail.toString().indexOf(codicons.file_submodule + " ") === 0) && (b.detail.toString().indexOf(codicons.file_directory + " ") === 0)) {
                    return -1;
                }
                
                if ((a.detail.toString().indexOf(codicons.file_directory + " ") === 0) && (b.detail.toString().indexOf(codicons.file_submodule + " ") === 0)) {
                    return 1;
                }
                
                if ((a.detail.toString().indexOf(codicons.file_submodule + " ") === 0) && (b.detail.toString().indexOf(codicons.file_submodule + " ") === -1)) {
                    return 1;
                }
                
                if ((a.detail.toString().indexOf(codicons.file_submodule + " ") === -1) && (b.detail.toString().indexOf(codicons.file_submodule + " ") === 0)) {
                    return -1;
                }
                
                if ((a.detail.toString().indexOf(codicons.file_directory + " ") === 0) && (b.detail.toString().indexOf(codicons.file_directory + " ") === -1)) {
                    return 1;
                }
                
                if ((a.detail.toString().indexOf(codicons.file_directory + " ") === -1) && (b.detail.toString().indexOf(codicons.file_directory + " ") === 0)) {
                    return -1;
                }
                
                return 0;
              });

              const options = <vscode.QuickPickOptions> {
                  placeHolder: "Type a line number or a piece of code to navigate to",
                  matchOnDescription: true,
                  onDidSelectItem: item => {

                      const itemT = <vscode.QuickPickItem> item;

                      let filePath: string;
                      // no detail - previously active document
                      if (!itemT.detail) {
                          filePath = activeTextEditorPath;
                      } else {
                          // with octicon - document outside project
                          if (itemT.detail.toString().indexOf(codicons.file_directory + " ") === 0) {
                              filePath = itemT.detail.toString().split(codicons.file_directory + " ").pop();
                          } else { // with octicon - documento from other workspaceFolder
                            if (itemT.detail.toString().indexOf(codicons.file_submodule) === 0) {
                                filePath = itemT.detail.toString().split(codicons.file_submodule + " ").pop();
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

                      const point: Point = parsePosition(itemT.description);
                      if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri.fsPath.toLowerCase() === filePath.toLowerCase()) {
                        if (point) {
                            revealPosition(point.line - 1, point.column - 1);
                        }
                      } else {
                          const uriDocument: vscode.Uri = vscode.Uri.file(filePath);
                          vscode.workspace.openTextDocument(uriDocument).then(doc => {
                              vscode.window.showTextDocument(doc, { preserveFocus: true, preview: true }).then(() => {
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
                        const uriDocument: vscode.Uri = vscode.Uri.file(activeTextEditorPath);
                        vscode.workspace.openTextDocument(uriDocument).then(doc => {
                            vscode.window.showTextDocument(doc).then(() => {
                                revealLine(currentLine - 1);
                                return;
                            });
                        });                          
                      }
                  }
                  
                  if (typeof selection === "undefined") {
                      return;
                  }

                  const point: Point = parsePosition(selection.description);
                  if (!selection.detail) {
                    if (point) {
                        revealPosition(point.line - 1, point.column - 1);
                    }
                  } else {
                      let newPath: string;
                      // with octicon - document outside project
                      if (selection.detail.toString().indexOf(codicons.file_directory + " ") === 0) {
                          newPath = selection.detail.toString().split(codicons.file_directory + " ").pop();
                      } else {// no octicon - document inside project
                        if (selection.detail.toString().indexOf(codicons.file_submodule) === 0) {
                            newPath = selection.detail.toString().split(codicons.file_submodule + " ").pop();
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
                      const uriDocument: vscode.Uri = vscode.Uri.file(newPath);
                      vscode.workspace.openTextDocument(uriDocument).then(doc => {
                          vscode.window.showTextDocument(doc).then(() => {
                            if (point) {
                                revealPosition(point.line - 1, point.column - 1);
                            }        
                          });
                      });
                  }
              });
            }  
        );
    }

    function jumpToNext(direction: Directions) {
        
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to jump to bookmarks");
          return;
        }
        
        if (!controller.activeBookmark) {
            return;
        }      
        
        // 
        nextBookmark(controller.activeBookmark, vscode.window.activeTextEditor.selection.active, direction)
            .then((next) => {
              if (typeof next === "number") {

                if (!checkBookmarks(next)) {
                    return;
                }

                controller.nextDocumentWithBookmarks(controller.activeBookmark, direction)
                  .then((nextDocument) => {
                      
                      if (nextDocument === NO_MORE_BOOKMARKS) {
                        return;
                      }

                      // same document?
                      const activeDocument = Controller.normalize(vscode.window.activeTextEditor.document.uri.fsPath);
                      if (nextDocument.toString() === activeDocument) {
                        const bookmarkIndex = direction === Directions.Forward ? 0 : controller.activeBookmark.bookmarks.length - 1;
                        revealPosition(controller.activeBookmark.bookmarks[bookmarkIndex].line, 
                            controller.activeBookmark.bookmarks[bookmarkIndex].column);
                        } else { 
                            vscode.workspace.openTextDocument(nextDocument.toString()).then(doc => {
                                vscode.window.showTextDocument(doc).then(() => {
                                    const bookmarkIndex = direction === Directions.Forward ? 0 : controller.activeBookmark.bookmarks.length - 1;
                                    revealPosition(controller.activeBookmark.bookmarks[bookmarkIndex].line, 
                                        controller.activeBookmark.bookmarks[bookmarkIndex].column);
                            });
                        });
                      }
                  })
                  .catch(checkBookmarks);
              } else {
                  revealPosition(next.line, next.character);
              }
            })
            .catch((error) => {
              console.log("activeBookmark.nextBookmark REJECT" + error);
            });
    }

    function checkBookmarks(result: number | vscode.Position): boolean {
        if (result === NO_BOOKMARKS_BEFORE || result === NO_BOOKMARKS_AFTER) {
            vscode.window.showInformationMessage("No more bookmarks");
            return false;
        }
        return true;
    }

    function askForBookmarkLabel(index: number, position: vscode.Position, oldLabel?: string, jumpToPosition?: boolean,
                                 book?: File) {
        const ibo = <vscode.InputBoxOptions> {
            prompt: "Bookmark Label",
            placeHolder: "Type a label for your bookmark",
            value: oldLabel
        };
        vscode.window.showInputBox(ibo).then(bookmarkLabel => {
            if (typeof bookmarkLabel === "undefined") {
                return;
            }
            // 'empty'
            if (bookmarkLabel === "" && oldLabel === "") {
                vscode.window.showWarningMessage("You must define a label for the bookmark.");
                return;
            }
            if (index >= 0) {
                controller.removeBookmark(index, position.line, book);
            }
            controller.addBookmark(position, bookmarkLabel, book);
            
            // toggle editing mode
            if (jumpToPosition) {
                vscode.window.showTextDocument(vscode.window.activeTextEditor.document, { preview: false, viewColumn: vscode.window.activeTextEditor.viewColumn });
            }
            // sorted
            /* let itemsSorted = [] =*/
            const b: File = book ? book : controller.activeBookmark;
            sortBookmarks(b);
            saveWorkspaceState();
            updateDecorations();
        });
    }

    async function toggle() {
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage("Open a file first to toggle bookmarks");
          return;
        }         
      
        if (vscode.window.activeTextEditor.document.uri.scheme === SEARCH_EDITOR_SCHEME) {
          vscode.window.showInformationMessage("You can't toggle bookmarks in Search Editor");
          return;
        }         
      
        const selections = vscode.window.activeTextEditor.selections;

        // fix issue emptyAtLaunch
        if (!controller.activeBookmark) {
            controller.addFile(vscode.window.activeTextEditor.document.uri);
            controller.activeBookmark = controller.fromUri(vscode.window.activeTextEditor.document.uri);
        }

        if (await controller.toggle(selections)) {
            vscode.window.showTextDocument(vscode.window.activeTextEditor.document, {preview: false, viewColumn: vscode.window.activeTextEditor.viewColumn} );
        }

        sortBookmarks(controller.activeBookmark);
        saveWorkspaceState();
        updateDecorations();
    }

    async function toggleLabeled() {

        if (!vscode.window.activeTextEditor) {
            vscode.window.showInformationMessage("Open a file first to toggle bookmarks");
            return;
        }

        const selections = vscode.window.activeTextEditor.selections;

        // fix issue emptyAtLaunch
        if (!controller.activeBookmark) {
            controller.addFile(vscode.window.activeTextEditor.document.uri);
            controller.activeBookmark = controller.fromUri(vscode.window.activeTextEditor.document.uri);
        }

        let suggestion = suggestLabel(vscode.window.activeTextEditor.selection);
        if (suggestion !== "" && useSelectionWhenAvailable()) {
            if (await controller.toggle(selections, suggestion)) {
                vscode.window.showTextDocument(vscode.window.activeTextEditor.document, {preview: false, viewColumn: vscode.window.activeTextEditor.viewColumn} );
            }
            sortBookmarks(controller.activeBookmark); 
            saveWorkspaceState();
            updateDecorations();
            return;
        }

        // ask label
        let oldLabel = "";
        if (suggestion === "" && selections.length === 1) {
            const index = indexOfBookmark(controller.activeBookmark, selections[0].active.line);
            oldLabel = index > -1 ? controller.activeBookmark.bookmarks[index].label : "";
            suggestion = oldLabel;
        }
        // let oldLabel: string = "";
        // if (selections.length === 1) {
        //     const index = bookmarks.activeBookmark.indexOfBookmark(selections[0].active.line);
        //     oldLabel = index > -1 ? bookmarks.activeBookmark.bookmarks[index].label : "";
        // }
        const ibo = <vscode.InputBoxOptions> {
            prompt: "Bookmark Label",
            placeHolder: "Type a label for your bookmark",
            value: suggestion
        };
        const newLabel = await vscode.window.showInputBox(ibo);
        if (typeof newLabel === "undefined") { return; }
        if (newLabel === "" && oldLabel === "") {
            vscode.window.showWarningMessage("You must define a label for the bookmark.");
            return;
        }

        if (await controller.toggle(selections, newLabel)) {
            vscode.window.showTextDocument(vscode.window.activeTextEditor.document, {preview: false, viewColumn: vscode.window.activeTextEditor.viewColumn} );
        }

        // sorted
        /* let itemsSorted = [] =*/
        const b: File = controller.activeBookmark;
        b.bookmarks.sort((n1, n2) => {
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
    }
}