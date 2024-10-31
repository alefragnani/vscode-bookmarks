/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Position, TextDocument, Uri } from "vscode";
import { codicons } from "vscode-ext-codicons";
import { BookmarkQuickPickItem } from "../vscode-bookmarks-core/src/bookmark";
import { NO_BOOKMARKS_AFTER, NO_BOOKMARKS_BEFORE, NO_MORE_BOOKMARKS } from "../vscode-bookmarks-core/src/constants";
import { Directions, isWindows, SEARCH_EDITOR_SCHEME } from "../vscode-bookmarks-core/src/constants";
import { Container } from "../vscode-bookmarks-core/src/container";
import { createBookmarkDecorations, updateDecorationsInActiveEditor } from "../vscode-bookmarks-core/src/decoration";
import { File } from "../vscode-bookmarks-core/src/file";
import { Controller } from "../vscode-bookmarks-core/src/controller";
import { indexOfBookmark, listBookmarks, nextBookmark, sortBookmarks } from "../vscode-bookmarks-core/src/operations";
import { loadBookmarks, saveBookmarks } from "../vscode-bookmarks-core/src/workspaceState";
import { pickController } from "../vscode-bookmarks-core/src/quickpick/controllerPicker";
import { expandSelectionToNextBookmark, selectBookmarkedLines, shrinkSelection } from "../vscode-bookmarks-core/src/selections";
import { BookmarksExplorer } from "../vscode-bookmarks-core/src/sidebar/bookmarkProvider";
import { parsePosition, Point } from "../vscode-bookmarks-core/src/sidebar/parser";
import { Sticky } from "../vscode-bookmarks-core/src/stickyLegacy";
import { updateStickyBookmarks } from "../vscode-bookmarks-core/src/sticky";
import { suggestLabel, useSelectionWhenAvailable } from "../vscode-bookmarks-core/src/suggestion";
import { appendPath, getRelativePath } from "../vscode-bookmarks-core/src/utils/fs";
import { isInDiffEditor, previewPositionInDocument, revealPosition } from "../vscode-bookmarks-core/src/utils/reveal";
import { registerOpenSettings } from "./commands/openSettings";
import { registerSupportBookmarks } from "./commands/supportBookmarks";
import { registerHelpAndFeedbackView } from "./sidebar/helpAndFeedbackView";
import { registerWhatsNew } from "./whats-new/commands";
import { ViewAs } from "../vscode-bookmarks-core/src/sidebar/nodes";
import { Selection } from "vscode";
import { EditorLineNumberContextParams, updateLinesWithBookmarkContext } from "./gutter/editorLineNumberContext";
import { registerGutterCommands } from "./gutter/commands";
import { registerWalkthrough } from "./commands/walkthrough";

// this method is called when vs code is activated
export async function activate(context: vscode.ExtensionContext) {

    Container.context = context;
  
    let activeController: Controller;
    let controllers: Controller[] = [];
    let activeEditorCountLine: number;
    let timeout: NodeJS.Timer;

    await registerWhatsNew();
    await registerWalkthrough();
    
    context.subscriptions.push(vscode.commands.registerCommand("_bookmarks.openFolderWelcome", () => {
        const openFolderCommand = isWindows ? "workbench.action.files.openFolder" : "workbench.action.files.openFileFolder"
        vscode.commands.executeCommand(openFolderCommand)
    }));    
    
    // load pre-saved bookmarks
    await loadWorkspaceState();
    
    registerOpenSettings();
    registerSupportBookmarks();
    registerHelpAndFeedbackView(context);

    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(cfg => {
        // Allow change the gutterIcon without reload
        if (cfg.affectsConfiguration("bookmarks.gutterIconFillColor") || 
            cfg.affectsConfiguration("bookmarks.gutterIconBorderColor") ||
            cfg.affectsConfiguration("bookmarks.overviewRulerLane")) {
            if (bookmarkDecorationType.length > 0) {
                bookmarkDecorationType.forEach(b => b.dispose());
            }

            bookmarkDecorationType = createBookmarkDecorations();
            context.subscriptions.push(...bookmarkDecorationType);

            updateDecorations();
            bookmarkProvider.refresh();
        }
        
        if (cfg.affectsConfiguration("bookmarks.saveBookmarksInProject")) {
            splitOrMergeFilesInMultiRootControllers();
            saveWorkspaceState();
        }

        if (cfg.affectsConfiguration("bookmarks.sideBar.countBadge")) {
            bookmarkExplorer.updateBadge();
        }
    }));

    let bookmarkDecorationType = createBookmarkDecorations();
    context.subscriptions.push(...bookmarkDecorationType);

    // Connect it to the Editors Events
    let activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
        getActiveController(activeEditor.document);
        activeController.addFile(activeEditor.document.uri);
        activeEditorCountLine = activeEditor.document.lineCount;
        activeController.activeFile = activeController.fromUri(activeEditor.document.uri);
        triggerUpdateDecorations();
        updateLinesWithBookmarkContext(activeController.activeFile);
    }

    const bookmarkExplorer = new BookmarksExplorer(controllers);
    const bookmarkProvider = bookmarkExplorer.getProvider();    

    bookmarkExplorer.updateBadge();

    vscode.commands.registerCommand("_bookmarks.sidebar.hidePosition", () => toggleSidebarPositionVisibility(false));
    vscode.commands.registerCommand("_bookmarks.sidebar.showPosition", () => toggleSidebarPositionVisibility(true));
    vscode.commands.executeCommand("setContext", "bookmarks.isHidingPosition", 
        Container.context.globalState.get<boolean>("bookmarks.sidebar.hidePosition", false));
    function toggleSidebarPositionVisibility(visible: boolean) {
        vscode.commands.executeCommand("setContext", "bookmarks.isHidingPosition", !visible);
        Container.context.globalState.update("bookmarks.sidebar.hidePosition", !visible);
        bookmarkProvider.refresh();
    }   
    
    const viewAsList = Container.context.globalState.get<boolean>("viewAsList", false);
    vscode.commands.executeCommand("setContext", "bookmarks.viewAsList", viewAsList);
    vscode.commands.registerCommand("_bookmarks.viewAsTree#sideBar", () => toggleViewAs(ViewAs.VIEW_AS_TREE));
    vscode.commands.registerCommand("_bookmarks.viewAsList#sideBar", () => toggleViewAs(ViewAs.VIEW_AS_LIST));
    function toggleViewAs(view: ViewAs) {
        if (view === ViewAs.VIEW_AS_LIST) {
            vscode.commands.executeCommand("setContext", "bookmarks.viewAsList", true);
        } else {
            vscode.commands.executeCommand("setContext", "bookmarks.viewAsList", false);
        }
        Container.context.globalState.update("viewAsList", view === ViewAs.VIEW_AS_LIST);
        bookmarkProvider.refresh();
    }

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            activeEditorCountLine = editor.document.lineCount;
            getActiveController(editor.document);
            activeController.addFile(editor.document.uri);
            activeController.activeFile = activeController.fromUri(editor.document.uri);
            triggerUpdateDecorations();
            updateLinesWithBookmarkContext(activeController.activeFile);
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
            if (activeController.activeFile && activeController.activeFile.bookmarks.length > 0) {
                if (vscode.workspace.getConfiguration("bookmarks").get<boolean>("experimental.enableNewStickyEngine", true)) {
                    updatedBookmark = updateStickyBookmarks(event, activeController.activeFile,
                        activeEditor, activeController);
                } else {
                    updatedBookmark = Sticky.stickyBookmarks(event, activeEditorCountLine, activeController.activeFile,
                        activeEditor, activeController);
                }
            }

            activeEditorCountLine = event.document.lineCount;
            updateDecorations();

            if (updatedBookmark) {
                saveWorkspaceState();
            }
        }
    }, null, context.subscriptions);

    context.subscriptions.push(vscode.workspace.onDidRenameFiles(async rename => {
        
        if (rename.files.length === 0) { return; } 
        
        for (const file of rename.files) {
            const files = activeController.files.map(file => file.path);
            const stat = await vscode.workspace.fs.stat(file.newUri);
            
            const fileRelativeOldPath = getRelativePath(activeController.workspaceFolder.uri.path, file.oldUri.path);
            const fileRelativeNewPath = getRelativePath(activeController.workspaceFolder.uri.path, file.newUri.path);

            if (stat.type === vscode.FileType.File) {
                if (files.includes(fileRelativeOldPath)) {
                    activeController.updateFilePath(fileRelativeOldPath, fileRelativeNewPath);
                }
            }
            if (stat.type === vscode.FileType.Directory) {
                activeController.updateDirectoryPath(fileRelativeOldPath, fileRelativeNewPath);
            }
        }

        bookmarkProvider.refresh();
        saveWorkspaceState();
        if (activeEditor) {
            activeController.activeFile = activeController.fromUri(activeEditor.document.uri);
            updateDecorations();
        }
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
        updateDecorationsInActiveEditor(activeEditor, activeController, bookmarkDecorationType);
    }

    updateDecorations();

    vscode.commands.registerCommand("_bookmarks.jumpTo", (documentPath, line, column: string, uri: Uri) => {
        vscode.workspace.openTextDocument(uri).then(doc => {
            vscode.window.showTextDocument(doc ).then(() => {
                const lineInt: number = parseInt(line, 10);
                const colunnInt: number = parseInt(column, 10);
                revealPosition(lineInt - 1, colunnInt - 1);
            });
        });
    });

    registerGutterCommands(toggle, toggleLabeled);

    vscode.commands.registerCommand("bookmarks.refresh", () => {
        bookmarkProvider.refresh();
    });

    vscode.commands.registerCommand("_bookmarks.clearFromFile", node => {
        activeController.clear(node.bookmark);
        saveWorkspaceState();
        updateDecorations();
    });

    vscode.commands.registerCommand("_bookmarks.deleteBookmark", node => {
        const book: File = activeController.fromUri(node.command.arguments[3]);
        const index = indexOfBookmark(book, node.command.arguments[1] - 1); 
        activeController.removeBookmark(index, node.command.arguments[1] - 1, book);
        saveWorkspaceState();
        updateDecorations();
    });

    vscode.commands.registerCommand("_bookmarks.editLabel", node => {
        const book: File = activeController.fromUri(node.command.arguments[3]);
        const index = indexOfBookmark(book, node.command.arguments[1] - 1);

        const position: vscode.Position = new vscode.Position(node.command.arguments[1] - 1, 
            node.command.arguments[2] - 1);
        askForBookmarkLabel(index, position, book.bookmarks[index].label, false, book);
    });

    vscode.commands.registerCommand("bookmarks.clear", () => clear());
    vscode.commands.registerCommand("bookmarks.clearFromAllFiles", () => clearFromAllFiles());
    vscode.commands.registerCommand("bookmarks.selectLines", () => selectBookmarkedLines(activeController));
    vscode.commands.registerCommand("bookmarks.expandSelectionToNext", () => expandSelectionToNextBookmark(activeController, Directions.Forward));
    vscode.commands.registerCommand("bookmarks.expandSelectionToPrevious", () => expandSelectionToNextBookmark(activeController, Directions.Backward));
    vscode.commands.registerCommand("bookmarks.shrinkSelection", () => shrinkSelection(activeController));
    vscode.commands.registerCommand("bookmarks.toggle", () => toggle());
    vscode.commands.registerCommand("bookmarks.toggleLabeled", () => toggleLabeled());    
    vscode.commands.registerCommand("bookmarks.jumpToNext", () => jumpToNext(Directions.Forward));
    vscode.commands.registerCommand("bookmarks.jumpToPrevious", () => jumpToNext(Directions.Backward));
    vscode.commands.registerCommand("bookmarks.list", () => list());
    vscode.commands.registerCommand("bookmarks.listFromAllFiles", () => listFromAllFiles());
    
    function getActiveController(document: TextDocument): void {
        // system files don't have workspace, so use the first one [0]
        if (!vscode.workspace.getWorkspaceFolder(document.uri)) {
            activeController = controllers[0];
            return;
        }

        if (controllers.length > 1) {
            activeController = controllers.find(ctrl =>
                ctrl.workspaceFolder.uri.path === vscode.workspace.getWorkspaceFolder(document.uri).uri.path);
        }
    }

    function splitOrMergeFilesInMultiRootControllers(): void {
        // 
        if (vscode.workspace.workspaceFolders.length < 2) {
            return;
        }

        //?? needs work
        const saveBookmarksInProject = vscode.workspace.getConfiguration("bookmarks").get("saveBookmarksInProject", false);

        if (saveBookmarksInProject) {
            const validFiles = activeController.files.filter(file => !file.path.startsWith(".."));
            activeController.files = [...validFiles];
        }
    }

    async function loadWorkspaceState(): Promise<void> {

        // no workspace, load as `undefined` and will always be from `workspaceState`
        if (!vscode.workspace.workspaceFolders) {
            const ctrl = await loadBookmarks(undefined);
            controllers.push(ctrl);
            activeController = ctrl;
            return;
        }

        // NOT `saveBookmarksInProject`
        if (!vscode.workspace.getConfiguration("bookmarks").get("saveBookmarksInProject", false)) {
            //if (vscode.workspace.workspaceFolders.length > 1) {
            // no matter how many workspaceFolders exists, will always load from [0] because even with 
            // multi-root, there would be no way to load state from different folders
            const ctrl = await loadBookmarks(vscode.workspace.workspaceFolders[0]);
            controllers.push(ctrl);
            activeController = ctrl;
            return;
        }

        // `saveBookmarksInProject` TRUE
        // single or multi-root, will load from each `workspaceFolder`
        controllers = await Promise.all(
            vscode.workspace.workspaceFolders!.map(async workspaceFolder => {
                const ctrl = await loadBookmarks(workspaceFolder);
                return ctrl;
            })
        );
        if (controllers.length === 1) {
            activeController = controllers[0];
        }
    }

    function saveWorkspaceState(): void {
        // no workspace, there is only one `controller`, and will always be from `workspaceState`
        if (!vscode.workspace.workspaceFolders) {
            saveBookmarks(activeController);
            return;
        }

        // NOT `saveBookmarksInProject`, will load from `workspaceFolders[0]` - as before
        if (!vscode.workspace.getConfiguration("bookmarks").get("saveBookmarksInProject", false)) {
            // no matter how many workspaceFolders exists, will always save to [0] because even with
            // multi-root, there would be no way to save state to different folders
            saveBookmarks(activeController);
            return;
        }

        // `saveBookmarksInProject` TRUE
        // single or multi-root, will save to each `workspaceFolder` 
        controllers.forEach(controller => {
            saveBookmarks(controller);
        });
    }

    function list() {
        
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage(vscode.l10n.t("Open a file first to list bookmarks"));
          return;
        }
        
        // no active bookmark
        if (!activeController.activeFile) {
            vscode.window.showInformationMessage(vscode.l10n.t("No Bookmarks found"));
            return;  
        }
      
        // no bookmark
        if (activeController.activeFile.bookmarks.length === 0) {
            vscode.window.showInformationMessage(vscode.l10n.t("No Bookmarks found"));
            return;
        }

        // push the items
        const items: vscode.QuickPickItem[] = [];
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < activeController.activeFile.bookmarks.length; index++) {

            const bookmarkLine = activeController.activeFile.bookmarks[index].line + 1;
            const bookmarkColumn = activeController.activeFile.bookmarks[index].column + 1;
            const lineText = vscode.window.activeTextEditor.document.lineAt(bookmarkLine - 1).text.trim();

            if (activeController.activeFile.bookmarks[index].label === "") {
                items.push({ description: "(Ln " + bookmarkLine.toString() + ", Col " + 
                    bookmarkColumn.toString() + ")", label: lineText });
            } else {
                items.push({ description: "(Ln " + bookmarkLine.toString() + ", Col " + 
                bookmarkColumn.toString() + ")", 
                label: codicons.tag + " " + activeController.activeFile.bookmarks[index].label });
            }
        }

        // pick one
        const currentPosition: Position = vscode.window.activeTextEditor.selection.active;
        const options = <vscode.QuickPickOptions> {
            placeHolder: vscode.l10n.t("Type a line number or a piece of code to navigate to"),
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
                revealPosition(currentPosition.line, currentPosition.character);
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
          vscode.window.showInformationMessage(vscode.l10n.t("Open a file first to clear bookmarks"));
          return;
        }      
      
        activeController.clear();
        saveWorkspaceState();
        updateDecorations();
    }

    async function clearFromAllFiles() {
        
        const controller = await pickController(controllers, activeController);
        if (!controller) {
            return
        }
        
        controller.clearAll();

        saveWorkspaceState();
        updateDecorations();
    }

    async function listFromAllFiles() {

        const controller = await pickController(controllers, activeController);
        if (!controller) {
            return
        }

        // no bookmark
        if (!controller.hasAnyBookmark()) {
            vscode.window.showInformationMessage(vscode.l10n.t("No Bookmarks found"));
            return;
        }

        // push the items
        const items: BookmarkQuickPickItem[] = [];
        const activeTextEditor = vscode.window.activeTextEditor;
        const promisses = [];
        const currentPosition: Position = vscode.window.activeTextEditor?.selection.active;
        
        for (const bookmark of controller.files) {
            const pp = listBookmarks(bookmark, controller.workspaceFolder);
            promisses.push(pp);
        }
        
        Promise.all(promisses).then(
          (values) => {
              
              for (const element of values) {
                  if (element) {
                    for (const elementInside of element) {
                        if (activeTextEditor &&
                            elementInside.detail.toString().toLocaleLowerCase() === getRelativePath(controller.workspaceFolder?.uri?.path, activeTextEditor.document.uri.path).toLocaleLowerCase()) {
                            items.push(
                                {
                                    label: elementInside.label,
                                    description: elementInside.description,
                                    uri: elementInside.uri
                                }
                            );
                        } else {
                            items.push(
                                {
                                    label: elementInside.label,
                                    description: elementInside.description,
                                    detail: elementInside.detail,
                                    uri: elementInside.uri
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
                  placeHolder: vscode.l10n.t("Type a line number or a piece of code to navigate to"),
                  matchOnDescription: true,
                  onDidSelectItem: item => {

                    const itemT = <BookmarkQuickPickItem> item;

                    let fileUri: Uri;
                    if (!itemT.detail) {
                        fileUri = activeTextEditor.document.uri;
                    } else {
                        fileUri = itemT.uri;
                    }

                      const point: Point = parsePosition(itemT.description);
                      if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri.fsPath.toLowerCase() === fileUri.fsPath.toLowerCase()) {
                        if (point) {
                            revealPosition(point.line - 1, point.column - 1);
                        }
                      } else {
                        previewPositionInDocument(point, fileUri);
                      }
                  }
              };
              vscode.window.showQuickPick(itemsSorted, options).then(selection => {
                  if (typeof selection === "undefined") {
                      if (!activeTextEditor)  {
                            vscode.commands.executeCommand("workbench.action.closeActiveEditor");
                          return;
                      } else {
                        vscode.workspace.openTextDocument(activeTextEditor.document.uri).then(doc => {
                            vscode.window.showTextDocument(doc).then(() => {
                                revealPosition(currentPosition.line, currentPosition.character);
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
                  }
              });
            }  
        );
    }

    function jumpToNext(direction: Directions) {
        
        if (!vscode.window.activeTextEditor) {
          vscode.window.showInformationMessage(vscode.l10n.t("Open a file first to jump to bookmarks"));
          return;
        }
        
        if (!activeController.activeFile) {
            return;
        }      
        
        // 
        nextBookmark(activeController.activeFile, vscode.window.activeTextEditor.selection.active, direction)
            .then((next) => {
              if (typeof next === "number") {

                if (!checkBookmarks(next)) {
                    return;
                }

                activeController.nextDocumentWithBookmarks(activeController.activeFile, direction)
                  .then((nextDocument) => {
                      
                      if (nextDocument === NO_MORE_BOOKMARKS) {
                        return;
                      }

                      let uriDocument: Uri;
                      if (typeof nextDocument === "string") {
                        uriDocument = !activeController.workspaceFolder
                            ? Uri.file(nextDocument.toString())
                            : appendPath(activeController.workspaceFolder.uri, nextDocument.toString());
                      } else {
                          uriDocument = <Uri>nextDocument;
                      }

                      // same document?
                    //   const activeDocument = getRelativePath(activeController.workspaceFolder?.uri?.path, vscode.window.activeTextEditor.document.uri.fsPath);
                    //   if (nextDocument.toString() === activeDocument) {
                      if (uriDocument.fsPath === vscode.window.activeTextEditor.document.uri.fsPath) {
                        const bookmarkIndex = direction === Directions.Forward ? 0 : activeController.activeFile.bookmarks.length - 1;
                        revealPosition(activeController.activeFile.bookmarks[bookmarkIndex].line, 
                            activeController.activeFile.bookmarks[bookmarkIndex].column);
                        } else { 
                            // const uriDocument = !activeController.workspaceFolder
                            //     ? Uri.file(nextDocument.toString())
                            //     : appendPath(activeController.workspaceFolder.uri, nextDocument.toString());
                            vscode.workspace.openTextDocument(uriDocument).then(doc => {
                                vscode.window.showTextDocument(doc).then(() => {
                                    const bookmarkIndex = direction === Directions.Forward ? 0 : activeController.activeFile.bookmarks.length - 1;
                                    revealPosition(activeController.activeFile.bookmarks[bookmarkIndex].line, 
                                        activeController.activeFile.bookmarks[bookmarkIndex].column);
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
            if (vscode.workspace.getConfiguration("bookmarks").get("showNoMoreBookmarksWarning", true)) {
                vscode.window.showInformationMessage(vscode.l10n.t("No more bookmarks"));
            }
            return false;
        }
        return true;
    }

    function askForBookmarkLabel(index: number, position: vscode.Position, oldLabel?: string, jumpToPosition?: boolean,
                                 book?: File) {
        const ibo = <vscode.InputBoxOptions> {
            prompt: vscode.l10n.t("Bookmark Label"),
            placeHolder: vscode.l10n.t("Type a label for your bookmark"),
            value: oldLabel
        };
        vscode.window.showInputBox(ibo).then(bookmarkLabel => {
            if (typeof bookmarkLabel === "undefined") {
                return;
            }
            // 'empty'
            if (bookmarkLabel === "" && oldLabel === "") {
                vscode.window.showWarningMessage(vscode.l10n.t("You must define a label for the bookmark."));
                return;
            }
            if (index >= 0) {
                activeController.removeBookmark(index, position.line, book);
            }
            activeController.addBookmark(position, bookmarkLabel, book);
            
            // toggle editing mode
            if (jumpToPosition) {
                vscode.window.showTextDocument(vscode.window.activeTextEditor.document, { preview: false, viewColumn: vscode.window.activeTextEditor.viewColumn });
            }
            // sorted
            /* let itemsSorted = [] =*/
            const b: File = book ? book : activeController.activeFile;
            sortBookmarks(b);
            saveWorkspaceState();
            updateDecorations();
        });
    }

    async function toggle(params?: EditorLineNumberContextParams) {
        const selections: Selection[] = [];

        if (params) {
            const posAnchor = new Position(params.lineNumber - 1, 0);
            const posActive= new Position(params.lineNumber - 1, 0);
            const sel = new Selection(posAnchor, posActive);
            selections.push(sel);
        } else {

            if (!vscode.window.activeTextEditor) {
                vscode.window.showInformationMessage(vscode.l10n.t("Open a file first to toggle bookmarks"));
                return;
            }         
            
            if (vscode.window.activeTextEditor.document.uri.scheme === SEARCH_EDITOR_SCHEME) {
                vscode.window.showInformationMessage(vscode.l10n.t("You can't toggle bookmarks in Search Editor"));
                return;
            }         
            
            selections.push(...vscode.window.activeTextEditor.selections);
        }

        // fix issue emptyAtLaunch
        if (!activeController.activeFile) {
            activeController.addFile(vscode.window.activeTextEditor.document.uri);
            activeController.activeFile = activeController.fromUri(vscode.window.activeTextEditor.document.uri);
        }

        if (await activeController.toggle(selections)) {
            if (!isInDiffEditor()) {
                vscode.window.showTextDocument(vscode.window.activeTextEditor.document, {preview: false, viewColumn: vscode.window.activeTextEditor.viewColumn} );
            }
        }

        sortBookmarks(activeController.activeFile);
        saveWorkspaceState();
        updateDecorations();
        updateLinesWithBookmarkContext(activeController.activeFile);
        // bookmarkExplorer.updateBadge();
    }

    async function toggleLabeled(params?: EditorLineNumberContextParams) {

        const selections: Selection[] = [];

        if (params) {
            const posAnchor = new Position(params.lineNumber - 1, 0);
            const posActive= new Position(params.lineNumber - 1, 0);
            const sel = new Selection(posAnchor, posActive);
            selections.push(sel);
        } else {
            if (!vscode.window.activeTextEditor) {
                vscode.window.showInformationMessage(vscode.l10n.t("Open a file first to toggle bookmarks"));
                return;
            }

            selections.push(...vscode.window.activeTextEditor.selections);
        }
        // fix issue emptyAtLaunch
        if (!activeController.activeFile) {
            activeController.addFile(vscode.window.activeTextEditor.document.uri);
            activeController.activeFile = activeController.fromUri(vscode.window.activeTextEditor.document.uri);
        }

        let suggestion = suggestLabel(vscode.window.activeTextEditor.selection);
        if (!params && suggestion !== "" && useSelectionWhenAvailable()) {
            if (await activeController.toggle(selections, suggestion)) {
                vscode.window.showTextDocument(vscode.window.activeTextEditor.document, {preview: false, viewColumn: vscode.window.activeTextEditor.viewColumn} );
            }
            sortBookmarks(activeController.activeFile); 
            saveWorkspaceState();
            updateDecorations();
            updateLinesWithBookmarkContext(activeController.activeFile);
            return;
        }

        // ask label
        let oldLabel = "";
        if (!params && suggestion === "" && selections.length === 1) {
            const index = indexOfBookmark(activeController.activeFile, selections[0].active.line);
            oldLabel = index > -1 ? activeController.activeFile.bookmarks[index].label : "";
            suggestion = oldLabel;
        }
        // let oldLabel: string = "";
        // if (selections.length === 1) {
        //     const index = bookmarks.activeBookmark.indexOfBookmark(selections[0].active.line);
        //     oldLabel = index > -1 ? bookmarks.activeBookmark.bookmarks[index].label : "";
        // }
        const ibo = <vscode.InputBoxOptions> {
            prompt: vscode.l10n.t("Bookmark Label"),
            placeHolder: vscode.l10n.t("Type a label for your bookmark"),
            value: !params ? suggestion : ""
        };
        const newLabel = await vscode.window.showInputBox(ibo);
        if (typeof newLabel === "undefined") { return; }
        if (newLabel === "" && oldLabel === "") {
            vscode.window.showWarningMessage(vscode.l10n.t("You must define a label for the bookmark."));
            return;
        }

        if (await activeController.toggle(selections, newLabel)) {
            vscode.window.showTextDocument(vscode.window.activeTextEditor.document, {preview: false, viewColumn: vscode.window.activeTextEditor.viewColumn} );
        }

        // sorted
        /* let itemsSorted = [] =*/
        const b: File = activeController.activeFile;
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
        updateLinesWithBookmarkContext(activeController.activeFile);
    }
}