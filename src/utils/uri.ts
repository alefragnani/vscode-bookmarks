/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import os = require("os");
import path = require("path");
import { Uri, workspace, WorkspaceFolder } from "vscode";
import { UNTITLED_SCHEME } from "../core/constants";

const isWindows = os.platform() === "win32";

function normalizeFilePathForComparison(filePath: string): string {
    let normalizedPath = path.normalize(filePath).replace(/\\/g, "/");
    if (isWindows) {
        normalizedPath = normalizedPath.toLowerCase();
    }
    return normalizedPath;
}

export function getUriKey(uri: Uri): string {
    if (uri.scheme === "file") {
        return `file:${normalizeFilePathForComparison(uri.fsPath)}`;
    }

    const authority = uri.authority ? `//${uri.authority}` : "";
    const query = uri.query ? `?${uri.query}` : "";
    const fragment = uri.fragment ? `#${uri.fragment}` : "";
    return `${uri.scheme}:${authority}${uri.path}${query}${fragment}`;
}

export function areUrisEqual(left: Uri | undefined, right: Uri | undefined): boolean {
    if (!left || !right) {
        return false;
    }

    return getUriKey(left) === getUriKey(right);
}

export function parseUri(uriLike: unknown): Uri | undefined {
    if (!uriLike) {
        return undefined;
    }

    if (typeof uriLike === "string") {
        if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(uriLike)) {
            return undefined;
        }

        try {
            return Uri.parse(uriLike, true);
        } catch {
            return undefined;
        }
    }

    if (typeof uriLike === "object") {
        const uriComponents = uriLike as { scheme?: unknown; path?: unknown };
        if (typeof uriComponents.scheme !== "string" || typeof uriComponents.path !== "string") {
            return undefined;
        }

        try {
            return Uri.from(uriLike as { scheme: string; authority?: string; path: string; query?: string; fragment?: string; });
        } catch {
            return undefined;
        }
    }

    return undefined;
}

export function isUntitledUri(uri: Uri | undefined): boolean {
    return !!uri && uri.scheme === UNTITLED_SCHEME;
}

function getRelativeUriPath(folderUri: Uri, targetUri: Uri): string | undefined {
    const normalizedFolderPath = folderUri.path.endsWith("/")
        ? folderUri.path
        : `${folderUri.path}/`;

    if (!targetUri.path.startsWith(normalizedFolderPath)) {
        return undefined;
    }

    return targetUri.path.slice(normalizedFolderPath.length);
}

export function getUriDisplayPath(uri: Uri, workspaceFolder?: WorkspaceFolder): string {
    if (isUntitledUri(uri)) {
        return uri.path;
    }

    const targetWorkspaceFolder = workspaceFolder && workspace.getWorkspaceFolder(uri);
    if (workspaceFolder && targetWorkspaceFolder && areUrisEqual(workspaceFolder.uri, targetWorkspaceFolder.uri)) {
        if (uri.scheme === "file") {
            let relativePath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
            if (isWindows) {
                relativePath = relativePath.replace(/\\/g, "/");
            }
            return relativePath;
        }

        const relativeUriPath = getRelativeUriPath(workspaceFolder.uri, uri);
        if (typeof relativeUriPath !== "undefined") {
            return relativeUriPath;
        }
    }

    if (uri.scheme === "file") {
        let filePath = uri.fsPath;
        if (isWindows) {
            filePath = filePath.replace(/\\/g, "/");
        }
        return filePath;
    }

    return uri.toString(true);
}
