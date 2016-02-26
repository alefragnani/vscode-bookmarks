// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');
import fs = require('fs');
import crypto = require('crypto');

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
  let activeEditorCountLine: number;

	class Bookmark {
		fsPath: string;
		bookmarks: number[];

		constructor(uri: vscode.Uri) {
			this.fsPath = uri.fsPath;
			this.bookmarks = [];
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
		gutterIconPath: pathIcon
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
    activeEditorCountLine = doc.lineCount;
		bookmarks.add(doc.uri);
	});

	vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor !== null) {
      activeEditorCountLine = editor.document.lineCount;
    }

		activeEditor = editor;
		if (editor) {
			activeBookmark = bookmarks.fromUri(editor.document.uri);
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
      // call sticky function when the activeEditor is changed
      if (activeBookmark.bookmarks.length > 0) {
        stickyBookmarks(event);
      }

      activeEditorCountLine = event.document.lineCount;
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	// Timeout
	var timeout = null;
	function triggerUpdateDecorations() {
    updateDecorations();
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

    // Remove all bookmarks if active file is empty
    if (activeEditor.document.lineCount === 1 && activeEditor.document.lineAt(0).text === "") {
      activeBookmark.bookmarks = [];
    } else {
      for (var index = 0; index < activeBookmark.bookmarks.length; index++) {
        var element = activeBookmark.bookmarks[index];
        var decoration = new vscode.Range(element, 0, element, 0);
        books.push(decoration);
      }
    }
		activeEditor.setDecorations(bookmarkDecorationType, books);
	}


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
		saveWorkspaceState();
		updateDecorations();
	});


	vscode.commands.registerCommand('bookmarks.jumpToNext', () => {

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
		for (var index = 0; index < activeBookmark.bookmarks.length; index++) {
			var element = activeBookmark.bookmarks[index];
			if (element > line) {
				nextBookmark = element;
				break;
			}
		}

		if (typeof nextBookmark == 'undefined') {
			nextBookmark = activeBookmark.bookmarks[0];
		}

		// go to found line
		var newSe = new vscode.Selection(nextBookmark, 0, nextBookmark,0);
		vscode.window.activeTextEditor.selection = newSe;
		vscode.window.activeTextEditor.revealRange(newSe, vscode.TextEditorRevealType.InCenter)
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
			nextBookmark = activeBookmark.bookmarks[activeBookmark.bookmarks.length-1];
		}

		// go to found line
		var newSe = new vscode.Selection(nextBookmark, 0, nextBookmark,0);
		vscode.window.activeTextEditor.selection = newSe;
		vscode.window.activeTextEditor.revealRange(newSe, vscode.TextEditorRevealType.InCenter)
	});


	vscode.commands.registerCommand('bookmarks.clear', () => {
		activeBookmark.bookmarks.length = 0;

		saveWorkspaceState();
		updateDecorations();
	});

  // function used to attach bookmarks at the line
  function stickyBookmarks(event) {
    let diffLine: number;

    if (event.document.lineCount > activeEditorCountLine) {
      diffLine = event.document.lineCount - activeEditorCountLine;
    } else if (event.document.lineCount < activeEditorCountLine) {
      diffLine = activeEditorCountLine - event.document.lineCount;
      diffLine = 0 - diffLine;
    }

    for (let index in activeBookmark.bookmarks) {
      let eventLine = event.contentChanges[0].range.start.line;

      if (activeBookmark.bookmarks[index] > eventLine) {
        let newLine = activeBookmark.bookmarks[index] + diffLine;
        if (newLine < 0) {
          newLine = 0;
        }

        activeBookmark.bookmarks[index] = newLine;
      }
    }
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


