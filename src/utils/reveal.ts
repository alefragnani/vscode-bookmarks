/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Alessandro Fragnani. All rights reserved.
 *  Licensed under the GPLv3 License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Selection, Uri, window, workspace } from "vscode";
import { Bookmark } from "../core/bookmark";
import { getRevealLocationConfig } from "./revealLocation";

function resolveNavigationColumn(line: number, storedColumn: number): number {
    const columnMode = workspace.getConfiguration("bookmarks").get<string>("navigation.columnMode", "stored");
    if (columnMode === "lineStart") {
        return 0;
    }
    if (columnMode === "stored") {
        return storedColumn;
    }
    const lineText = window.activeTextEditor?.document.lineAt(line).text ?? "";
    if (columnMode === "firstNonWhitespace") {
        const firstNonWhitespace = lineText.search(/\S/);
        return firstNonWhitespace === -1 ? 0 : firstNonWhitespace;
    }
    if (columnMode === "lineEnd") {
        return lineText.trimEnd().length;
    }
    return storedColumn;
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
        const resolvedColumn = resolveNavigationColumn(line, column);
        const revealType = getRevealLocationConfig(line === window.activeTextEditor.selection.active.line);
        const newPosition = new Selection(line, resolvedColumn, line, resolvedColumn);
        window.activeTextEditor.selection = newPosition;
        window.activeTextEditor.revealRange(newPosition, revealType);
    }
}

export async function previewPositionInDocument(point: Bookmark, uri: Uri): Promise<void> {
    const textDocument = await workspace.openTextDocument(uri);
    await window.showTextDocument(textDocument, { preserveFocus: true, preview: true });
    revealPosition(point.line - 1, point.column - 1);
}

export async function revealPositionInDocument(point: Bookmark, uri: Uri): Promise<void> {
    const textDocument = await workspace.openTextDocument(uri);
    await window.showTextDocument(textDocument, undefined, false);
    revealPosition(point.line, point.column);
}

export function isInDiffEditor(): boolean {
    return window.activeTextEditor?.viewColumn === undefined;
}