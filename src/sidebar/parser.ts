/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export interface Point {
    line: number,
    column: number
}

export function parsePosition(position: string): Point | undefined {
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

export function encodePosition(line: number, column: number): string {
    return " (Ln " + line.toString() + ", Col " + column.toString() + ")";
}