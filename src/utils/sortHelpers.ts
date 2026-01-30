/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

/**
 * Extract leading number from text (e.g., "11. startup" -> 11, "abc" -> NaN)
 */
export function extractLeadingNumber(text: string): number {
    // Remove the pencil icon prefix if present (used in BookmarkPreview)
    const cleanText = text.replace(/^\u270E\s*/, "");
    const match = cleanText.match(/^(\d+)/);
    return match ? Number(match[1]) : NaN;
}
