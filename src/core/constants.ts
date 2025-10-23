/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import os = require("os");

export enum Directions {
    Forward,
    Backward
}

export enum BadgeConfig {
    All = "all",
    Files = "files",
    Off = "off"
}

export const SEARCH_EDITOR_SCHEME = "search-editor-body";
export const UNTITLED_SCHEME = "untitled";

export const isWindows = os.platform() === "win32";

export const NO_BOOKMARKS = -1;
export const NO_MORE_BOOKMARKS = -2;
export const NO_BOOKMARKS_BEFORE = -3;
export const NO_BOOKMARKS_AFTER = -4;

export const WORKSPACE_ROOTPATH  = "$ROOTPATH$";

export const DEFAULT_GUTTER_ICON_FILL_COLOR = "#157EFB";
export const DEFAULT_GUTTER_ICON_BORDER_COLOR = "#157EFB";