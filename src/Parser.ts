"use strict"

export interface Point {
    line: number,
    column: number
}

export class Parser {

    public static parsePosition(position: string): Point | undefined {
        let re: RegExp = new RegExp(/\(Ln\s(\d+)\,\sCol\s(\d+)\)/);
        let matches = re.exec(position);
        if (matches) {
            return {
                line: parseInt(matches[ 1 ], 10),
                column: parseInt(matches[ 2 ], 10)
            };
        }
        return undefined;
    }

    public static encodePosition(line: number, column: number): string {
        return " (Ln " + line.toString() + ", Col " + column.toString() + ")";
    }
}