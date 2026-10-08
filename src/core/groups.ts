/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { ConfigurationChangeEvent, workspace } from "vscode";
import {
    DEFAULT_GROUP_COLORS,
    DEFAULT_GROUP_NAMES,
    DEFAULT_GUTTER_ICON_BORDER_COLOR,
    DEFAULT_GUTTER_ICON_FILL_COLOR,
    MAX_GROUPS
} from "./constants";

export interface BookmarkGroup {
    id: number;
    name: string;
    color: string;
    borderColor: string;
}

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

interface RawGroup {
    id?: number;
    name?: string;
    color?: string;
    borderColor?: string;
}

function isValidColor(value: unknown): value is string {
    return typeof value === "string" && HEX_COLOR.test(value);
}

function defaultGroup(slot: number, legacyFill?: string, legacyBorder?: string): BookmarkGroup {
    const id = slot;
    const color = id === 0 && legacyFill && isValidColor(legacyFill)
        ? legacyFill
        : DEFAULT_GROUP_COLORS[slot];
    const borderColor = id === 0 && legacyBorder && isValidColor(legacyBorder)
        ? legacyBorder
        : DEFAULT_GROUP_COLORS[slot];
    return {
        id,
        name: DEFAULT_GROUP_NAMES[slot],
        color,
        borderColor
    };
}

export function getGroups(): BookmarkGroup[] {
    const cfg = workspace.getConfiguration("bookmarks");
    const raw = cfg.get<RawGroup[]>("groups", []);
    const legacyFill = cfg.get<string>("gutterIconFillColor", DEFAULT_GUTTER_ICON_FILL_COLOR);
    const legacyBorder = cfg.get<string>("gutterIconBorderColor", DEFAULT_GUTTER_ICON_BORDER_COLOR);

    const groups: BookmarkGroup[] = [];
    for (let slot = 0; slot < MAX_GROUPS; slot++) {
        groups.push(defaultGroup(slot, legacyFill, legacyBorder));
    }

    if (Array.isArray(raw)) {
        for (const entry of raw) {
            if (!entry || typeof entry !== "object") {
                continue;
            }
            const id = typeof entry.id === "number" ? Math.floor(entry.id) : NaN;
            if (!Number.isFinite(id) || id < 0 || id >= MAX_GROUPS) {
                continue;
            }
            const slot = id;
            const merged = groups[slot];
            if (typeof entry.name === "string" && entry.name.length > 0) {
                merged.name = entry.name;
            }
            if (isValidColor(entry.color)) {
                merged.color = entry.color;
                merged.borderColor = entry.color;
            }
            if (isValidColor(entry.borderColor)) {
                merged.borderColor = entry.borderColor;
            }
        }
    }

    return groups;
}

export function getGroup(id: number): BookmarkGroup {
    const groups = getGroups();
    if (id < 0 || id >= MAX_GROUPS) {
        return groups[0];
    }
    return groups[id];
}

export function groupsConfigChanged(e: ConfigurationChangeEvent): boolean {
    return e.affectsConfiguration("bookmarks.groups")
        || e.affectsConfiguration("bookmarks.gutterIconFillColor")
        || e.affectsConfiguration("bookmarks.gutterIconBorderColor");
}
