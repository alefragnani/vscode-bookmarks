/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import path = require("path");
import { QuickPickItem, window } from "vscode";
import { codicons } from "vscode-ext-codicons";
import { Controller } from "../core/controller";

interface ControllerQuickPickItem extends QuickPickItem {
    controller: Controller;
}

export async function pickController(controllers: Controller[], activeController: Controller): Promise<Controller | undefined> {
    
    if (controllers.length === 1) {
        return activeController;
    } 

    const items: ControllerQuickPickItem[] = controllers.map(controller => {
        return {
            label: codicons.root_folder + ' ' + controller.workspaceFolder.name,
            description: path.dirname(controller.workspaceFolder.uri.path),
            controller: controller
        };
    }
    );

    const selection = await window.showQuickPick(items, {
        placeHolder: 'Select a workspace'
    });

    if (typeof selection === "undefined") {
        return undefined;
    }

    return selection.controller;
}