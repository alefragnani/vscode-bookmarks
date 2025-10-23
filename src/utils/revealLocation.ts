/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { TextEditorRevealType, workspace } from "vscode";

export enum RevealLocation {
    Top = "top",
    Center = "center"
}

export function getRevealLocationConfig(ifOutsideViewport: boolean): TextEditorRevealType {
    const configuration = workspace.getConfiguration("bookmarks");
    const revealLocation = configuration.get<RevealLocation>("revealLocation", RevealLocation.Center);

    return revealLocation === RevealLocation.Top ?
        TextEditorRevealType.AtTop :
        ifOutsideViewport ?
            TextEditorRevealType.InCenterIfOutsideViewport :
            TextEditorRevealType.InCenter;
}