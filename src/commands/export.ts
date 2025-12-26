/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands, l10n, Uri, window, workspace } from "vscode";
import { Container } from "../core/container";
import { Controller } from "../core/controller";
import { getRelativePath } from "../utils/fs";

interface BookmarkExportItem {
    file: string;
    line: number;
    column: number;
    label: string;
    content: string;
}

async function getLineContent(fileUri: Uri, lineNumber: number): Promise<string> {
    try {
        const document = await workspace.openTextDocument(fileUri);
        if (lineNumber < document.lineCount) {
            return document.lineAt(lineNumber).text.trim();
        }
        return "";
    } catch (error) {
        return "";
    }
}

function escapeForMarkdown(text: string): string {
    return text.replace(/\|/g, "\\|");
}

async function collectBookmarks(controllers: Controller[]): Promise<BookmarkExportItem[]> {
    const bookmarkItems: BookmarkExportItem[] = [];

    for (const controller of controllers) {
        for (const file of controller.files) {
            if (file.bookmarks.length === 0) {
                continue;
            }

            // Sort bookmarks by line number
            const sortedBookmarks = [...file.bookmarks].sort((a, b) => a.line - b.line);

            for (const bookmark of sortedBookmarks) {
                const fileUri = file.uri || Uri.file(file.path);
                const content = await getLineContent(fileUri, bookmark.line);
                
                // Get relative path for display
                let displayPath = file.path;
                if (controller.workspaceFolder) {
                    displayPath = getRelativePath(controller.workspaceFolder.uri.fsPath, file.path);
                }

                bookmarkItems.push({
                    file: displayPath,
                    line: bookmark.line + 1, // Convert to 1-based line numbers
                    column: bookmark.column + 1, // Convert to 1-based column numbers
                    label: bookmark.label || "",
                    content: content
                });
            }
        }
    }

    // Sort by file path, then by line number
    bookmarkItems.sort((a, b) => {
        if (a.file !== b.file) {
            return a.file.localeCompare(b.file);
        }
        return a.line - b.line;
    });

    return bookmarkItems;
}

function formatBookmarks(bookmarks: BookmarkExportItem[], pattern: string): string {
    if (bookmarks.length === 0) {
        return l10n.t("No bookmarks to export.");
    }

    const lines: string[] = [];

    // Check if using default table format
    const isDefaultTableFormat = pattern.includes("|");
    
    if (isDefaultTableFormat) {
        // Add table header
        lines.push("| File | Line | Column | Label | Content |");
        lines.push("|------|------|--------|-------|---------|");
    }

    for (const bookmark of bookmarks) {
        const line = pattern
            .replace(/\$file/g, isDefaultTableFormat ? escapeForMarkdown(bookmark.file) : bookmark.file)
            .replace(/\$line/g, bookmark.line.toString())
            .replace(/\$column/g, bookmark.column.toString())
            .replace(/\$label/g, isDefaultTableFormat ? escapeForMarkdown(bookmark.label) : bookmark.label)
            .replace(/\$content/g, isDefaultTableFormat ? escapeForMarkdown(bookmark.content) : bookmark.content);
        
        lines.push(line);
    }

    return lines.join("\n");
}

export function registerExport(getControllers: () => Controller[]) {
    Container.context.subscriptions.push(commands.registerCommand("bookmarks.export", async () => {
        try {
            const controllers = getControllers();
            const bookmarks = await collectBookmarks(controllers);
            
            if (bookmarks.length === 0) {
                window.showInformationMessage(l10n.t("No bookmarks to export."));
                return;
            }

            // Get export pattern from configuration
            const pattern = workspace.getConfiguration("bookmarks").get<string>(
                "export.pattern",
                "| $file | $line | $column | $label | $content |"
            );

            const exportContent = formatBookmarks(bookmarks, pattern);

            // Create a new document with the exported content
            const doc = await workspace.openTextDocument({
                content: exportContent,
                language: "markdown"
            });

            await window.showTextDocument(doc);

            window.showInformationMessage(
                l10n.t("Bookmarks exported successfully. {0} bookmarks found.", bookmarks.length)
            );
        } catch (error) {
            window.showErrorMessage(l10n.t("Error exporting bookmarks: {0}", error.toString()));
        }
    }));
}
