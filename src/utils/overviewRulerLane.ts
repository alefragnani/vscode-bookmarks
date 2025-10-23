/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { OverviewRulerLane, workspace } from "vscode";

export enum OverviewRulerLaneConfig {
    None = "none",
    Left = "left",
    Center = "center",
    Right = "right",
    Full = "full"
}

export function getOverviewRulerLaneConfig(): OverviewRulerLane | undefined {
    const configuration = workspace.getConfiguration("bookmarks");
    const configValue = configuration.get<OverviewRulerLaneConfig>("overviewRulerLane", OverviewRulerLaneConfig.Full);

    switch (configValue) {
        case OverviewRulerLaneConfig.Left:
            return OverviewRulerLane.Left;
        case OverviewRulerLaneConfig.Center:
            return OverviewRulerLane.Center;
        case OverviewRulerLaneConfig.Right:
            return OverviewRulerLane.Right;
        case OverviewRulerLaneConfig.Full:
            return OverviewRulerLane.Full;
        case OverviewRulerLaneConfig.None:
            return undefined;
    }
}