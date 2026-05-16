/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import os = require("os");
import path = require("path");
import { Uri, workspace, WorkspaceFolder } from "vscode";
import { Bookmark } from "../core/bookmark";
import { UNTITLED_SCHEME } from "../core/constants";
import { File } from "../core/file";
import { parseUri } from "./uri";

export function getRelativePath(folder: string, filePath: string) {
    if (!folder) {
        return filePath;
    }

    let relativePath = path.relative(folder, filePath);

    // multiplatform
    if (os.platform() === "win32") {
        relativePath = relativePath.replace(/\\/g, "/");
    }

    return relativePath;
}

export function appendPath(uri: Uri, pathSuffix: string): Uri {
    return Uri.joinPath(uri, pathSuffix);
}

export function uriJoin(uri: Uri, ...paths: string[]): string {
    return path.join(uri.fsPath, ...paths);
}

export function uriWith(uri: Uri, filePath: string): Uri {
    return Uri.joinPath(uri, filePath);
}

export async function uriExists(uri: Uri): Promise<boolean> {
    
    if (uri.scheme === UNTITLED_SCHEME) {
        return true;
    }

    try {
        await workspace.fs.stat(uri);
        return true;
    } catch {
        return false;
    }
}

export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await workspace.fs.stat(Uri.parse(filePath));
        return true;
    } catch {
        return false;
    }
}

export async function createDirectoryUri(uri: Uri): Promise<void> {
    return workspace.fs.createDirectory(uri);
}

export async function createDirectory(dir: string): Promise<void> {
    return workspace.fs.createDirectory(Uri.parse(dir));
}

export async function readFile(filePath: string): Promise<string> {
    const bytes = await workspace.fs.readFile(Uri.parse(filePath));
    return JSON.parse(new TextDecoder('utf-8').decode(bytes));
}

export async function readFileUri(uri: Uri): Promise<string> {
    const bytes = await workspace.fs.readFile(uri);
    return JSON.parse(new TextDecoder('utf-8').decode(bytes));
}

export async function readRAWFileUri(uri: Uri): Promise<string> {
    const bytes = await workspace.fs.readFile(uri);
    return new TextDecoder('utf-8').decode(bytes);
}

export async function writeFile(filePath: string, contents: string): Promise<void> {
    const writeData = new TextEncoder().encode(contents);
    await workspace.fs.writeFile(Uri.parse(filePath), writeData);
}

export async function writeFileUri(uri: Uri, contents: string): Promise<void> {
    const writeData = new TextEncoder().encode(contents);
    await workspace.fs.writeFile(uri, writeData);
}

export async function deleteFileUri(uri: Uri): Promise<void> {
    await workspace.fs.delete(uri, { recursive: false, useTrash: false});
}

export function parsePosition(position: string): Bookmark | undefined {
    const re = new RegExp(/\(Ln\s(\d+),\sCol\s(\d+)\)/);
    const matches = re.exec(position);
    if (matches) {
        return {
            line: parseInt(matches[ 1 ], 10),
            column: parseInt(matches[ 2 ], 10)
        };
    }
    return undefined;
}

export function getFileUri(file: File, workspaceFolder: WorkspaceFolder | undefined): Uri {
    if (file.uri) {
        file.uriString = file.uri.toString(true);
        return file.uri;
    }

    const isWindowsDrivePath = /^[a-zA-Z]:[\\/]/.test(file.path);
    const fileUriFromString = parseUri(file.uriString) ?? parseUri(isWindowsDrivePath ? undefined : file.path);
    if (fileUriFromString) {
        file.uri = fileUriFromString;
        file.uriString = fileUriFromString.toString(true);
        return fileUriFromString;
    }

    const isRelativePath = !isWindowsDrivePath && !path.isAbsolute(file.path);

    if (workspaceFolder && isRelativePath) {
        const relativeUri = Uri.joinPath(workspaceFolder.uri, file.path);
        file.uri = relativeUri;
        file.uriString = relativeUri.toString(true);
        return relativeUri;
    }

    const localUri = Uri.file(file.path);
    file.uri = localUri;
    file.uriString = localUri.toString(true);
    return localUri;
}
