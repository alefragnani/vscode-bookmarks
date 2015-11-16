// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
	
	
	class Bookmark {
		//uri: vscode.Uri;
		fsPath: string;
		bookmarks: number[];
		
		constructor(uri: vscode.Uri) {
			//this.uri = uri;
			this.fsPath = uri.fsPath;
			this.bookmarks = [];
		}	
	}
	
	class Bookmarks {
		bookmarks: Bookmark[];
		
		constructor() {
			this.bookmarks = [];
		}
				
		fromUri(uri: vscode.Uri) {
			for (var index = 0; index < this.bookmarks.length; index++) {
				var element = this.bookmarks[index];
				
				//if (element.uri == uri) {
				if (element.fsPath == uri.fsPath) {
					return element;
				}				
			}
		}
		
		add(uri: vscode.Uri) {
			var bookmark = new Bookmark(uri);
			this.bookmarks.push(bookmark);
		}
		
		delete(uri: vscode.Uri) {
			var bookmark = this.fromUri(uri);
			var index = this.bookmarks.indexOf(bookmark);
			if (index > -1) {
				this.bookmarks.splice(index, 1);
			}
		}
	}
	
	console.log('Bookmarks is activated');
	
	var bookmarks = new Bookmarks();
	
	// Define the Bookmark Decoration	
 	let pathIcon = context.asAbsolutePath('images\\bookmark.png');
	var bookmarkDecorationType = vscode.window.createTextEditorDecorationType({
		gutterIconPath: pathIcon
	});

	// Connect it to the Editors Events
	var activeEditor = vscode.window.activeTextEditor;	
	var activeBookmark: Bookmark;
	
	if (activeEditor) {
		bookmarks.add(activeEditor.document.uri);
		activeBookmark = bookmarks.fromUri(activeEditor.document.uri);
		triggerUpdateDecorations();
	}
	
	// new docs
	vscode.workspace.onDidOpenTextDocument(doc => {
		bookmarks.add(doc.uri);
	});
	
	// don't close, so it remains 'in memory'
	// vscode.workspace.onDidCloseTextDocument(doc => {
	// 	bookmarks.delete(doc.uri);
	// });
	

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
	
	
	// other commands
	vscode.commands.registerCommand('bookmarks.toggle', () => {
		let line = vscode.window.activeTextEditor.selection.active.line;
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
		updateDecorations();
	});
	

	vscode.commands.registerCommand('bookmarks.jumpToNext', () => {		

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
		updateDecorations();
	});
			
}


