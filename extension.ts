// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');
import fs = require('fs');

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {

    class Bookmark {
        fsPath: string;
        bookmarks: number[];

        constructor(uri: vscode.Uri) {
            this.fsPath = uri.fsPath;
            this.bookmarks = [];
        }

        public nextBookmark(currentline: number) {

            return new Promise((resolve, reject) => {

                if (this.bookmarks.length == 0) {
                    reject(0);
                }

                let nextBookmark: number;
                for (var index = 0; index < this.bookmarks.length; index++) {
                    var element = this.bookmarks[index];
                    if (element > currentline) {
                        nextBookmark = element;
                        break;
                    }
                }

                if (typeof nextBookmark == 'undefined') {
                    reject('undefined')
                } else {
                    resolve(nextBookmark);
                }
            })
        }
    }

    class Bookmarks {
        bookmarks: Bookmark[];

        constructor(jsonObject) {
            this.bookmarks = [];

            if (jsonObject != '') {
                for (let prop in jsonObject) this[prop] = jsonObject[prop];
            }
        }

        fromUri(uri: vscode.Uri) {
            for (var index = 0; index < this.bookmarks.length; index++) {
                var element = this.bookmarks[index];

                if (element.fsPath == uri.fsPath) {
                    return element;
                }
            }
        }

        add(uri: vscode.Uri) {
            let existing: Bookmark = this.fromUri(uri);
            if (typeof existing == 'undefined') {
                var bookmark = new Bookmark(uri);
                this.bookmarks.push(bookmark);
            }
        }

        public nextDocumentWithBookmarks(active: Bookmark) {

            var currentBookmark: Bookmark = active;
            var currentBookmarkId: number;
            for (var index = 0; index < this.bookmarks.length; index++) {
                var element = this.bookmarks[index];
                if (element == active) {
                    currentBookmarkId = index;
                }
            }

            return new Promise((resolve, reject) => {

                currentBookmarkId++;
                if (currentBookmarkId == bookmarks.bookmarks.length) {
                    currentBookmarkId = 0;
                }
                currentBookmark = this.bookmarks[currentBookmarkId];
                
                if (currentBookmark.bookmarks.length == 0) {                    
                    if (currentBookmark == activeBookmark) {
                        reject('undefined');
                    } else {
                        this.nextDocumentWithBookmarks(currentBookmark)
                            .then((nextDocument) => {
                                resolve(nextDocument);
                            })
                            .catch((error) => {
                                reject(error);
                            })
                    }                   
                } else {
                    resolve(currentBookmark.fsPath)
                }

            });

        }

        nextBookmark(active: Bookmark, currentLine: number) {

            var currentBookmark: Bookmark = active;
            var currentBookmarkId: number;
            for (var index = 0; index < this.bookmarks.length; index++) {
                var element = this.bookmarks[index];
                if (element == active) {
                    currentBookmarkId = index;
                }
            }

            return new Promise((resolve, reject) => {

                currentBookmark.nextBookmark(currentLine)
                    .then((newLine) => {
                        resolve(newLine);
                    })
                    .catch((error) => {
                        // next document                  
                        currentBookmarkId++;
                        if (currentBookmarkId = bookmarks.bookmarks.length) {
                            currentBookmarkId = 0;
                        }
                        currentBookmark = this.bookmarks[currentBookmarkId];

                    });

            });
            // return new Promise((resolve, reject) => {
                
            //     if (currentBookmark.bookmarks.length == 0) {                    
            //         currentBookmarkId++;
            //         if (currentBookmarkId = bookmarks.bookmarks.length) {
            //             currentBookmarkId = 0;
            //         }                                        
            //         currentBookmark = this.bookmarks[currentBookmarkId];        
            //     }
                
            // });
        }
    }

    console.log('Bookmarks is activated');

    var bookmarks: Bookmarks;
	
    // load pre-saved bookmarks
    let didLoadBookmarks: boolean = loadWorkspaceState();
	
    // Define the Bookmark Decoration
    let pathIcon: string = vscode.workspace.getConfiguration('bookmarks').get('gutterIconPath', '');
    if (pathIcon != '') {
        if (!fs.existsSync(pathIcon)) {
            vscode.window.showErrorMessage('The file "' + pathIcon + '" used for "bookmarks.gutterIconPath" does not exists.');
            pathIcon = context.asAbsolutePath('images\\bookmark.png');
        }
    } else {
        pathIcon = context.asAbsolutePath('images\\bookmark.png');
    }
	
    //	let pathIcon = context.asAbsolutePath('images\\bookmark.png');
    var bookmarkDecorationType = vscode.window.createTextEditorDecorationType({
        gutterIconPath: pathIcon,
        overviewRulerLane: vscode.OverviewRulerLane.Full,
        overviewRulerColor: 'rgba(21, 126, 251, 0.7)'
    });

    // Connect it to the Editors Events
    var activeEditor = vscode.window.activeTextEditor;
    var activeBookmark: Bookmark;

    if (activeEditor) {
        if (!didLoadBookmarks) {
            bookmarks.add(activeEditor.document.uri);
        }
        activeBookmark = bookmarks.fromUri(activeEditor.document.uri);
        triggerUpdateDecorations();
    }
	
    // new docs
    vscode.workspace.onDidOpenTextDocument(doc => {
        bookmarks.add(doc.uri);
    });

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            activeBookmark = bookmarks.fromUri(editor.document.uri);
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    // Timeout
    var timeout = null;
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

        if (!activeBookmark) {
            return;
        }

        if (activeBookmark.bookmarks.length == 0) {
            var books: vscode.Range[] = [];
            activeEditor.setDecorations(bookmarkDecorationType, books);
            return;
        }

        var books: vscode.Range[] = [];
        for (var index = 0; index < activeBookmark.bookmarks.length; index++) {
            var element = activeBookmark.bookmarks[index];

            var decoration = new vscode.Range(element, 0, element, 0);
            books.push(decoration);
        }
        activeEditor.setDecorations(bookmarkDecorationType, books);
    }

    vscode.commands.registerCommand('bookmarks.clear', () => {
        activeBookmark.bookmarks.length = 0;

        saveWorkspaceState();
        updateDecorations();
    });
	
    // other commands
    vscode.commands.registerCommand('bookmarks.toggle', () => {
        let line = vscode.window.activeTextEditor.selection.active.line;

        // fix issue emptyAtLaunch
        if (!activeBookmark) {
            bookmarks.add(vscode.window.activeTextEditor.document.uri);
            activeBookmark = bookmarks.fromUri(vscode.window.activeTextEditor.document.uri);
        }

        let index = activeBookmark.bookmarks.indexOf(line);
        if (index < 0) {
            activeBookmark.bookmarks.push(line);
        } else {
            activeBookmark.bookmarks.splice(index, 1);
        }		
		
        // sorted
        var itemsSorted = [] = activeBookmark.bookmarks.sort((n1, n2) => {
            if (n1 > n2) {
                return 1;
            }

            if (n1 < n2) {
                return -1;
            }

            return 0;
        });

        saveWorkspaceState();
        updateDecorations();
    });


    vscode.commands.registerCommand('bookmarks.jumpToNext', () => {

        if (!activeBookmark) {
            return;
        }      
        
        // 
        activeBookmark.nextBookmark(vscode.window.activeTextEditor.selection.active.line)
            .then((nextLine) => {
                revealLine(parseInt(nextLine.toString()));
            })
            .catch((error) => {
                // no bookmarks in this file
                //if (error.toString() == '0') {
                    bookmarks.nextDocumentWithBookmarks(activeBookmark)
                        .then((nextDocument) => {
                            vscode.workspace.openTextDocument(nextDocument.toString()).then(doc => {
                                vscode.window.showTextDocument(doc).then(editor => {
                                    // first bookmark of this document
                                    revealLine(activeBookmark.bookmarks[0]);
                                });
                            });
                        })
                        .catch((error) => {
                            vscode.window.showInformationMessage('No more bookmarks...');
                        })
                //}
            })
        
        
        // // promisses        
        // bookmarks.nextBookmark(activeBookmark, vscode.window.activeTextEditor.selection.active.line)
        //     .then((nextBookmark) => {
        //         // go to found line
        //         revealLine(nextBookmark);
        //     })
        //     .catch((error) => {
                
        //     });
        
		
        // original code .....
        // // Is there any bookmark?
        // if (activeBookmark.bookmarks.length == 0) {
        // 	return;
        // }				
		
        // // There is anyone below?
        // let line = vscode.window.activeTextEditor.selection.active.line;
        // let nextBookmark: number;
        // for (var index = 0; index < activeBookmark.bookmarks.length; index++) {
        // 	var element = activeBookmark.bookmarks[index];
        // 	if (element > line) {				
        // 		nextBookmark = element;
        // 		break;
        // 	}
        // }
		
        // if (typeof nextBookmark == 'undefined') {
        // 	nextBookmark = activeBookmark.bookmarks[0];
        // }
		
        // // go to found line
        // revealLine(nextBookmark);
    });

    vscode.commands.registerCommand('bookmarks.jumpToPrevious', () => {

        if (!activeBookmark) {
            return;
        }
		
        // Is there any bookmark?
        if (activeBookmark.bookmarks.length == 0) {
            return;
        }				
		
        // There is anyone below?
        let line = vscode.window.activeTextEditor.selection.active.line;
        let nextBookmark: number;
        for (var index = activeBookmark.bookmarks.length; index >= 0; index--) {
            var element = activeBookmark.bookmarks[index];
            if (element < line) {
                nextBookmark = element;
                break;
            }
        }

        if (typeof nextBookmark == 'undefined') {
            nextBookmark = activeBookmark.bookmarks[activeBookmark.bookmarks.length - 1];
        }
		
        // go to found line
        revealLine(nextBookmark);
    });


    vscode.commands.registerCommand('bookmarks.list', () => {
        // no bookmark
        if (activeBookmark.bookmarks.length == 0) {
            vscode.window.showInformationMessage("No Bookmark found");
            return;
        }

        // push the items
        let items: vscode.QuickPickItem[] = [];
        for (var index = 0; index < activeBookmark.bookmarks.length; index++) {
            var element = activeBookmark.bookmarks[index] + 1;

            let lineText = vscode.window.activeTextEditor.document.lineAt(element - 1).text;
            items.push({ label: element.toString(), description: lineText });
        }
		
        // pick one
        let currentLine: number = vscode.window.activeTextEditor.selection.active.line + 1;
        let options = <vscode.QuickPickOptions>{
            placeHolder: 'Type a line number or a piece of code to navigate to',
            matchOnDescription: true,
            onDidSelectItem: item => {
                revealLine(parseInt(item.label) - 1);
            }
        };

        vscode.window.showQuickPick(items, options).then(selection => {
            if (typeof selection == 'undefined') {
                revealLine(currentLine - 1);
                return;
            }
            revealLine(parseInt(selection.label) - 1);
        });
    });

    function revealLine(line: number) {
        var newSe = new vscode.Selection(line, 0, line, 0);
        vscode.window.activeTextEditor.selection = newSe;
        vscode.window.activeTextEditor.revealRange(newSe, vscode.TextEditorRevealType.InCenter);
    }




    function loadWorkspaceState(): boolean {
        let saveBookmarksBetweenSessions: boolean = vscode.workspace.getConfiguration('bookmarks').get('saveBookmarksBetweenSessions', false);
        if (!saveBookmarksBetweenSessions) {
            bookmarks = new Bookmarks('');
            return false;
        }

        let savedBookmarks = context.workspaceState.get('bookmarks', '');
        if (savedBookmarks != '') {
            bookmarks = new Bookmarks(JSON.parse(savedBookmarks));
        } else {
            bookmarks = new Bookmarks('');
        }
        return savedBookmarks != '';
    }

    function saveWorkspaceState(): void {
        let saveBookmarksBetweenSessions: boolean = vscode.workspace.getConfiguration('bookmarks').get('saveBookmarksBetweenSessions', false);
        if (!saveBookmarksBetweenSessions) {
            return;
        }

        context.workspaceState.update('bookmarks', JSON.stringify(bookmarks));
    }

}


