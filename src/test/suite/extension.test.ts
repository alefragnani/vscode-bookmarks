/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import os = require("os");
import path = require("path");

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { Controller } from '../../core/controller';

const timeout = async (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

suite('Extension Test Suite', () => {
    let extension: vscode.Extension<any>;
    vscode.window.showInformationMessage('Start all tests.');

    suiteSetup(() => {
        extension = vscode.extensions.getExtension('alefragnani.Bookmarks') as vscode.Extension<any>;
    });

    test('Sample test', () => {
        assert.equal(-1, [ 1, 2, 3 ].indexOf(5));
        assert.equal(-1, [ 1, 2, 3 ].indexOf(0));
    });

    test('Activation test', async () => {
        await extension.activate();
        assert.equal(extension.isActive, true);
    });

    test('Extension loads in VSCode and is active', async () => {
        await timeout(1500);
        assert.equal(extension.isActive, true);
    });

    test("Controller supports bookmarks on non-workspace URIs", () => {
        const controller = new Controller(undefined);
        const tempFileUri = vscode.Uri.file(path.join(os.tmpdir(), "bookmarks-controller-test.txt"));
        const settingsUri = vscode.Uri.parse("vscode-userdata:/User/settings.json");

        controller.addFile(tempFileUri);
        controller.addFile(settingsUri);

        assert.equal(controller.files.length, 2);
        assert.ok(controller.fromUri(tempFileUri));
        assert.ok(controller.fromUri(settingsUri));
        assert.notEqual(controller.fromUri(tempFileUri), controller.fromUri(settingsUri));
    });

    test("Controller zip persists URI identity and ignores untitled files", () => {
        const controller = new Controller(undefined);
        const localUri = vscode.Uri.file(path.join(os.tmpdir(), "bookmarks-zip-test.txt"));
        const untitledUri = vscode.Uri.parse("untitled:Untitled-999");

        controller.addFile(localUri);
        const localFile = controller.fromUri(localUri);
        if (!localFile) {
            throw new Error("Expected local file to be available in controller");
        }
        localFile.bookmarks.push({
            line: 1,
            column: 1,
            label: "local"
        });

        controller.addFile(untitledUri);
        const untitledFile = controller.fromUri(untitledUri);
        if (!untitledFile) {
            throw new Error("Expected untitled file to be available in controller");
        }
        untitledFile.bookmarks.push({
            line: 2,
            column: 1,
            label: "unsaved"
        });

        const zipped = controller.zip();

        assert.equal(zipped.files.length, 1);
        assert.equal(zipped.files[0].uriString, localUri.toString(true));
    });

    test("Controller loads v3 bookmarks using persisted uriString", () => {
        const controller = new Controller(undefined);
        const settingsUri = vscode.Uri.parse("vscode-userdata:/User/settings.json");

        controller.loadFrom({
            files: [
                {
                    path: "legacy/path.json",
                    uriString: settingsUri.toString(true),
                    bookmarks: [
                        {
                            line: 1,
                            column: 3,
                            label: "setting"
                        }
                    ]
                }
            ]
        });

        const restored = controller.fromUri(settingsUri);
        assert.ok(restored);
        assert.equal(restored.bookmarks.length, 1);
        assert.equal(restored.uriString, settingsUri.toString(true));
    });
});
