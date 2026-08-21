/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Selection, Uri, window, workspace } from "vscode";
import { getRevealLocationConfig } from "./revealLocation";

interface LineColumn {
    line: number;
    column: number;
}

export function revealLine(line: number, directJump?: boolean) {
    const newSe = new Selection(line, 0, line, 0);
    window.activeTextEditor.selection = newSe;
    window.activeTextEditor.revealRange(newSe, getRevealLocationConfig(directJump));
}

export function revealPosition(line: number, column: number): void {
    if (isNaN(column)) {
        revealLine(line);
    } else {
        const revealType = getRevealLocationConfig(line === window.activeTextEditor.selection.active.line);
        const newPosition = new Selection(line, column, line, column);
        window.activeTextEditor.selection = newPosition;
        window.activeTextEditor.revealRange(newPosition, revealType);
    }
}

export async function previewPositionInDocument(point: LineColumn, uri: Uri): Promise<void> {
    const textDocument = await workspace.openTextDocument(uri);
    await window.showTextDocument(textDocument, { preserveFocus: true, preview: true });
    revealPosition(point.line - 1, point.column - 1);
}

export async function revealPositionInDocument(point: LineColumn, uri: Uri): Promise<void> {
    const textDocument = await workspace.openTextDocument(uri);
    await window.showTextDocument(textDocument, undefined, false);
    revealPosition(point.line, point.column);
}

export function isInDiffEditor(): boolean {
    return window.activeTextEditor?.viewColumn === undefined;
}