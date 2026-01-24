/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Selection, workspace, window } from "vscode";

enum SuggestionMode {
    dontUse = "dontUse",
    suggestWhenSelected = "suggestWhenSelected",
    useWhenSelected = "useWhenSelected",
    suggestWhenSelectedOrLineWhenNoSelected = "suggestWhenSelectedOrLineWhenNoSelected"
}  

export function useSelectionWhenAvailable(): boolean {
    return workspace.getConfiguration("bookmarks")
        .get<SuggestionMode>("label.suggestion", SuggestionMode.dontUse) === SuggestionMode.useWhenSelected;
}

export function suggestLabel(selection: Selection): string {
    const configSuggestion = workspace.getConfiguration("bookmarks")
        .get<SuggestionMode>("label.suggestion", SuggestionMode.dontUse);
    switch (configSuggestion) {
        case SuggestionMode.dontUse:
            return "";
    
        case SuggestionMode.suggestWhenSelected:
        case SuggestionMode.useWhenSelected:
            if (!selection.isEmpty) {
                return window.activeTextEditor.document.getText(selection);
            } else {
                return "";
            }
    
        case SuggestionMode.suggestWhenSelectedOrLineWhenNoSelected:
            if (!selection.isEmpty) {
                return window.activeTextEditor.document.getText(selection);
            } else {
                return window.activeTextEditor.document.lineAt(selection.start.line).text.trim();
            }
    
        default:
            break;
    }
}