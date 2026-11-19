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

export const MAX_GROUPS = 10;
export const DEFAULT_GROUP_ID = 0;

export const DEFAULT_GROUP_COLORS: readonly string[] = [
    "#157EFB",
    "#FF6B6B",
    "#51CF66",
    "#FCC419",
    "#CC5DE8",
    "#22B8CF",
    "#FF922B",
    "#845EF7",
    "#868E96",
    "#20C997"
];

export const DEFAULT_GROUP_NAMES: readonly string[] = [
    "Default",
    "Group 1",
    "Group 2",
    "Group 3",
    "Group 4",
    "Group 5",
    "Group 6",
    "Group 7",
    "Group 8",
    "Group 9"
];