/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

"use strict";

import * as vscode from "vscode";
import { JUMP_FORWARD, JUMP_DIRECTION } from "./Bookmark";

export class Selection {

    public static selectLines(editor: vscode.TextEditor, lines: number[]): void {
        const doc = editor.document;
        editor.selections.shift();
        let sels = new Array<vscode.Selection>();
        let newSe;
        lines.forEach(line => {
            newSe = new vscode.Selection(line, 0, line, doc.lineAt(line).text.length);
            sels.push(newSe); 
        });
        editor.selections = sels;
    }

    public static expandLineRange(editor: vscode.TextEditor, toLine: number, direction: JUMP_DIRECTION) {
        const doc = editor.document;
        let newSe: vscode.Selection;   
        let actualSelection: vscode.Selection = editor.selection;  
                
        // no matter 'the previous selection'. going FORWARD will become 'isReversed = FALSE'
        if (direction === JUMP_FORWARD) {            
            
            if (actualSelection.isEmpty || !actualSelection.isReversed) {
                newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, toLine, doc.lineAt(toLine).text.length);
            } else {
                newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, toLine, doc.lineAt(toLine).text.length);
            }
        } else { // going BACKWARD will become 'isReversed = TRUE'
        
            if (actualSelection.isEmpty || !actualSelection.isReversed) {
                newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, toLine, 0);
            } else {
                newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, toLine, 0);
            }
        }
        editor.selection = newSe;
    }

    public static shrinkLineRange(editor: vscode.TextEditor, toLine: number, direction: JUMP_DIRECTION) {
        const doc = editor.document;
        let newSe: vscode.Selection;   
                
        // no matter 'the previous selection'. going FORWARD will become 'isReversed = FALSE'
        if (direction === JUMP_FORWARD) {    
            newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, toLine, 0);
        } else { // going BACKWARD , select to line length
            newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, toLine, doc.lineAt(toLine).text.length);
        }
        editor.selection = newSe;
    }       

    public static expandRange(editor: vscode.TextEditor, toPosition: vscode.Position, direction: JUMP_DIRECTION) {
        const doc = editor.document;
        let newSe: vscode.Selection;   
        let actualSelection: vscode.Selection = editor.selection;  
                
        // no matter 'the previous selection'. going FORWARD will become 'isReversed = FALSE'
        if (direction === JUMP_FORWARD) {                        
            if (actualSelection.isEmpty || !actualSelection.isReversed) {
                newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, 
                    toPosition.line, toPosition.character);
            } else {
                newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, 
                    toPosition.line, toPosition.character);
            }
        } else { // going BACKWARD will become 'isReversed = TRUE'
            if (actualSelection.isEmpty || !actualSelection.isReversed) {
                newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, 
                    toPosition.line, toPosition.character);
            } else {
                newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, 
                    toPosition.line, toPosition.character);
            }
        }
        editor.selection = newSe;
    }

    public static shrinkRange(editor: vscode.TextEditor, toPosition: vscode.Position, direction: JUMP_DIRECTION) {
        const doc = editor.document;
        let newSe: vscode.Selection;   
                
        // no matter 'the previous selection'. going FORWARD will become 'isReversed = FALSE'
        if (direction === JUMP_FORWARD) {    
            newSe = new vscode.Selection(editor.selection.end.line, editor.selection.end.character, 
                toPosition.line, toPosition.character);
        } else { // going BACKWARD , select to line length
            newSe = new vscode.Selection(editor.selection.start.line, editor.selection.start.character, 
                toPosition.line, toPosition.character);
        }
        editor.selection = newSe;
    }       


}