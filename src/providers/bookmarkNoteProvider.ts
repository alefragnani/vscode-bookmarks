import * as vscode from 'vscode';
import { Controller } from '../core/controller';
import { indexOfBookmark } from '../core/operations';
import { saveBookmarks } from '../storage/workspaceState';

export class BookmarkNoteProvider implements vscode.FileSystemProvider {

    constructor(private controllers: Controller[]) { }

    // Events
    private _onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._onDidChangeFile.event;

    watch(uri: vscode.Uri, options: { recursive: boolean; excludes: string[]; }): vscode.Disposable {
        // We don't really support watching yet, but we need to implement the method
        return new vscode.Disposable(() => { });
    }

    stat(uri: vscode.Uri): vscode.FileStat {
        return {
            type: vscode.FileType.File,
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0 // Size is dynamic, we could calculate it but 0 usually works for virtual
        };
    }

    readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
        return []; // We don't support directories
    }

    createDirectory(uri: vscode.Uri): void {
        throw vscode.FileSystemError.NoPermissions();
    }

    async readFile(uri: vscode.Uri): Promise<Uint8Array> {
        const { controller, file, index } = this.resolveUri(uri);
        const note = file.bookmarks[index].note || "";
        const encoder = new TextEncoder();
        return encoder.encode(note);
    }

    async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): Promise<void> {
        const { controller, file, index } = this.resolveUri(uri);
        const decoder = new TextDecoder();
        const note = decoder.decode(content);

        controller.updateBookmarkNote(file, index, note);
        await saveBookmarks(controller);

        // Notify change
        this._onDidChangeFile.fire([{ type: vscode.FileChangeType.Changed, uri }]);
    }

    delete(uri: vscode.Uri, options: { recursive: boolean; }): void {
        throw vscode.FileSystemError.NoPermissions();
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void {
        throw vscode.FileSystemError.NoPermissions();
    }

    private resolveUri(uri: vscode.Uri): { controller: Controller, file: any, index: number } {
        const query = JSON.parse(uri.query);
        const filePath = query.path;
        const line = query.line;

        const controller = this.controllers.find(c => {
            return c.files.some(f => f.path === filePath);
        });

        if (!controller) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const file = controller.files.find(f => f.path === filePath);
        if (!file) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const index = indexOfBookmark(file, line);
        if (index === -1) {
            throw vscode.FileSystemError.FileNotFound();
        }

        return { controller, file, index };
    }
}
