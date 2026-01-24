/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { ChangeLogItem, ChangeLogKind, ContentProvider, Header, Image, IssueKind, SupportChannel, SocialMediaProvider } from "../../vscode-whats-new/src/ContentProvider";

export class BookmarksContentProvider implements ContentProvider {

    public provideHeader(logoUrl: string): Header {
        return <Header>{
            logo: <Image>{ src: logoUrl, height: 50, width: 50 },
            message: `<b>Bookmarks</b> helps you to navigate in your code, <b>moving</b> 
            between important positions easily and quickly. No more need 
            to <i>search for code</i>. It also supports a set of <b>selection</b>
            commands, which allows you to select bookmarked lines and regions between
            lines.`};
    }

    public provideChangeLog(): ChangeLogItem[] {
        const changeLog: ChangeLogItem[] = [];

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "14.0.0", releaseDate: "November 2025" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Fully Open Source again",
                id: 523,
                kind: IssueKind.Issue,
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Update Side Bar: Count Badge description",
                id: 739,
                kind: IssueKind.Issue,
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Reuse opened file",
                id: 775,
                kind: IssueKind.Issue,
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "New setting to hide Welcome view",
                id: 792,
                kind: IssueKind.Issue,
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "New setting to specify the Bookmark's overview ruler lane",
                id: 357,
                kind: IssueKind.Issue,
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Added color format support for gutter icon color settings",
                id: 814,
                kind: IssueKind.PR,
                kudos: "@ajpemok"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Persian translations",
                id: 813,
                kind: IssueKind.PR,
                kudos: "@k1nxx"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "French translations",
                id: 789,
                kind: IssueKind.PR,
                kudos: "@alex-kinokon"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Hindi translations",
                id: 787,
                kind: IssueKind.PR,
                kudos: "@jatinderbhola"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Polish translations",
                id: 708,
                kind: IssueKind.PR,
                kudos: "@Rinnsy"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Update Simplified Chinese translations",
                id: 707,
                kind: IssueKind.PR,
                kudos: "@GreyElaina"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Clear command not updating context menu",
                id: 758,
                kind: IssueKind.Issue,
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Side Bar: Count Badge tooltip error",
                id: 809,
                kind: IssueKind.Issue,
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Incorrect command in documentation",
                id: 797,
                kind: IssueKind.Issue,
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Security Alert: braces",
                id: 728,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Security Alert: webpack",
                id: 746,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Security Alert: serialize-javascript and mocha",
                id: 772,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.5.0", releaseDate: "March 2024" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Turkish translations",
                id: 683,
                kind: IssueKind.PR,
                kudos: "@ksckaan1"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "New setting to choose viewport position on navigation",
                id: 504,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Simplified Chinese translations",
                id: 635,
                kind: IssueKind.PR,
                kudos: "@huangyxi"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Refine extension settings query",
                id: 681,
                kind: IssueKind.PR,
                kudos: "@aramikuto"
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.4.2", releaseDate: "September 2023" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Spanish translations",
                id: 629,
                kind: IssueKind.PR,
                kudos: "@JoseDeFreitas"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Toggle bookmark via mouse click (context menu) outdated by Explorer View",
                id: 627,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Support for <b>vscode-memfs FileSystemProvider</b>",
                id: 645,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Typos in Portuguese translations",
                id: 635,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Security Alert: word-wrap",
                id: 634,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.4.0", releaseDate: "June 2023" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Add <b>Getting Started/Walkthrough</b> support",
                id: 442,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Add Toggle bookmark via mouse click (context menu)",
                id: 615,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Add <b>Localization (l10n)</b> support",
                id: 565,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Add Side Bar Badge",
                id: 153,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.CHANGED,
            detail: {
                message: "Avoid What's New when using Gitpod",
                id: 611,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.CHANGED,
            detail: {
                message: "Avoid What's New when installing lower versions",
                id: 611,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Repeated gutter icon on line wrap",
                id: 552,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Support Implicit Activation Event API",
                id: 573,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Security Alert: minimatch",
                id: 566,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Security Alert: terser",
                id: 546,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });

        return changeLog;
    }

    public provideSupportChannels(): SupportChannel[] {
        const supportChannels: SupportChannel[] = [];
        supportChannels.push({
            title: "Become a sponsor on GitHub",
            link: "https://github.com/sponsors/alefragnani",
            message: "Become a Sponsor"
        });
        supportChannels.push({
            title: "Donate via PayPal",
            link: "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted",
            message: "Donate via PayPal"
        });
        return supportChannels;
    }
}

export class BookmarksSocialMediaProvider implements SocialMediaProvider {
    public provideSocialMedias() {
        return [{
            title: "Follow me on Twitter",
            link: "https://www.twitter.com/alefragnani"
        }];
    }
}