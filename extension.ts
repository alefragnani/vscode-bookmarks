// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');
import fs = require('fs');

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
    activeEditorCountLine = doc.lineCount;
		bookmarks.add(doc.uri);
	});

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			activeEditorCountLine = editor.document.lineCount;
			activeBookmark = bookmarks.fromUri(editor.document.uri);
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
		  // call sticky function when the activeEditor is changed
		  if (activeBookmark && activeBookmark.bookmarks.length > 0
        && event.document.lineCount != activeEditorCountLine) {
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
        revealLine(nextBookmark);
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
			items.push({ label: element.toString(), description: lineText});
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
    var newSe = new vscode.Selection(line, 0, line,0);
    vscode.window.activeTextEditor.selection = newSe;
    vscode.window.activeTextEditor.revealRange(newSe, vscode.TextEditorRevealType.InCenter);
  }

	vscode.commands.registerCommand('bookmarks.clear', () => {
		activeBookmark.bookmarks.length = 0;

		saveWorkspaceState();
		updateDecorations();
	});

  // remove bookmark if new line pasted on bookmarked line
  vscode.commands.registerCommand('bookmarks.paste', () => {
    if (activeBookmark && activeBookmark.bookmarks.length > 0) {
      let selection = vscode.window.activeTextEditor.selection;
      let lineRange = [selection.start.line, selection.end.line];
      let lineMin = Math.min.apply(this, lineRange);
      let lineMax = Math.max.apply(this, lineRange);

      if (selection.start.character > 0) {
        lineMin++;
      }

      if (selection.end.character < vscode.window.activeTextEditor.document.lineAt(selection.end).range.end.character) {
        lineMax--;
      }

      if (lineMin <= lineMax) {
        for (let i = lineMin; i <= lineMax; i++) {
          let index = activeBookmark.bookmarks.indexOf(i);
          if (index > -1) {
            activeBookmark.bookmarks.splice(index, 1);
          }
        }
      }
    }
    vscode.commands.executeCommand('editor.action.clipboardPasteAction');
  });

  vscode.commands.registerCommand('bookmarks.moveLineUp', (e) => {
    if (activeBookmark && activeBookmark.bookmarks.length > 0) {
      moveStickyBookmarks('up');
    }
    vscode.commands.executeCommand('editor.action.moveLinesUpAction');
  });

  vscode.commands.registerCommand('bookmarks.moveLineDown', () => {
    if (activeBookmark && activeBookmark.bookmarks.length > 0) {
      moveStickyBookmarks('down');
    }
    vscode.commands.executeCommand('editor.action.moveLinesDownAction');
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

  function moveStickyBookmarks(direction) {
    let diffChange: number = -1;
    let diffLine;
    let selection = activeEditor.selection;
    let lineRange = [selection.start.line, selection.end.line];
    let lineMin = Math.min.apply(this, lineRange);
    let lineMax = Math.max.apply(this, lineRange);

    if (selection.end.character === 0 && !selection.isSingleLine) {
      let lineAt = activeEditor.document.lineAt(selection.end.line - 1);
      let posMin = new vscode.Position(selection.start.line, selection.start.character);
      let posMax = new vscode.Position(selection.end.line - 1, lineAt.range.end.character);
      if (direction === 'up') {
        vscode.window.activeTextEditor.selection = new vscode.Selection(posMax, posMin);
      } else {
        vscode.window.activeTextEditor.selection = new vscode.Selection(posMin, posMax);
      }
      lineMax--;
    }

    if (direction === 'up') {
      diffLine = 1;

      let index = activeBookmark.bookmarks.indexOf(lineMin - 1);
      if (index > -1) {
        diffChange = lineMax;
        activeBookmark.bookmarks.splice(index, 1);
      }
    } else if (direction === 'down') {
      diffLine = -1;

      let index: number;
      index = activeBookmark.bookmarks.indexOf(lineMax + 1);
      if (index > -1) {
        diffChange = lineMin;
        activeBookmark.bookmarks.splice(index, 1);
      }
    }

    lineRange = [];
    for (let i = lineMin; i <= lineMax; i++) {
      lineRange.push(i);
    }
    lineRange = lineRange.sort();
    if (diffLine < 0) {
      lineRange = lineRange.reverse();
    }

    for (let i in lineRange) {
      let index = activeBookmark.bookmarks.indexOf(lineRange[i]);
      if (index > -1) {
        activeBookmark.bookmarks[index] -= diffLine;
      }
    }

    if (diffChange > -1) {
      activeBookmark.bookmarks.push(diffChange);
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


