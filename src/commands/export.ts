/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands, l10n, Uri, window, workspace } from "vscode";
import { Container } from "../core/container";
import { Controller } from "../core/controller";
import { getRelativePath, uriExists, uriWith } from "../utils/fs";
import { getLinePreview } from "../core/operations";

interface BookmarkExportItem {
    file: string;
    line: number;
    column: number;
    label: string;
    content: string;
}

function escapeForMarkdown(text: string): string {
    // Escape pipe characters for markdown tables
    // Also escape backslashes to prevent escape sequence issues
    return text.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
}

async function collectBookmarks(controllers: Controller[]): Promise<BookmarkExportItem[]> {
    const bookmarkItems: BookmarkExportItem[] = [];

    for (const controller of controllers) {
        for (const file of controller.files) {
            if (file.bookmarks.length === 0) {
                continue;
            }

            // Determine the file URI using the same logic as listBookmarks
            let uriDocBookmark: Uri;
            if (file.uri) {
                uriDocBookmark = file.uri;
            } else {
                if (!controller.workspaceFolder) {
                    uriDocBookmark = Uri.file(file.path);
                } else {
                    const prefix = controller.workspaceFolder.uri.path.endsWith("/")
                        ? controller.workspaceFolder.uri.path
                        : `${controller.workspaceFolder.uri.path}/`;
                    uriDocBookmark = uriWith(controller.workspaceFolder.uri, prefix, file.path);
                }
            }

            // Skip if file doesn't exist
            if (! await uriExists(uriDocBookmark)) {
                continue;
            }

            // Sort bookmarks by line number
            const sortedBookmarks = [...file.bookmarks].sort((a, b) => a.line - b.line);

            for (const bookmark of sortedBookmarks) {
                let content = "";
                try {
                    content = await getLinePreview(uriDocBookmark, bookmark.line);
                } catch (error) {
                    // If we can't get the line preview, use empty string
                    content = "";
                }
                
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

    // Check if using default table format by looking for the complete table pattern
    const isDefaultTableFormat = pattern.trim().startsWith("|") && pattern.trim().endsWith("|");
    
    if (isDefaultTableFormat) {
        // Add table header
        lines.push("| File | Line | Column | Label | Content |");
        lines.push("|------|------|--------|-------|---------|");
    }

    // Create a replacement map for efficient substitution
    for (const bookmark of bookmarks) {
        const replacements: { [key: string]: string } = {
            "$file": isDefaultTableFormat ? escapeForMarkdown(bookmark.file) : bookmark.file,
            "$line": bookmark.line.toString(),
            "$column": bookmark.column.toString(),
            "$label": isDefaultTableFormat ? escapeForMarkdown(bookmark.label) : bookmark.label,
            "$content": isDefaultTableFormat ? escapeForMarkdown(bookmark.content) : bookmark.content
        };

        let line = pattern;
        for (const [key, value] of Object.entries(replacements)) {
            // Escape special regex characters in the key
            const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            line = line.replace(new RegExp(escapedKey, "g"), value);
        }
        
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
