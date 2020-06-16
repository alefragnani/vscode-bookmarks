/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:max-line-length
import { ChangeLogItem, ChangeLogKind, ContentProvider, Header, Image, Sponsor, IssueKind } from "../../vscode-whats-new/src/ContentProvider";

export class WhatsNewBookmarksContentProvider implements ContentProvider {

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
        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "11.3.0", releaseDate: "June 2020" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Auto-save bookmarks when changing <b>saveBookmarksInProject</b> setting",
                id: 242,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.CHANGED,
            detail: {
                message: "Internal commands can't be customisable",
                id: 306,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Migrate from TSLint to ESLint",
                id: 290,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Remove <b>vscode</b> dependency",
                id: 296,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Use <b>vscode-ext-codicons</b> package",
                id: 309,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "11.2.0", releaseDate: "May 2020" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Adds <b>Label suggestion</b> based on selection",
                id: 239,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "<b>Side bar</b> welcome message",
                id: 284,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.CHANGED,
            detail: {
                message: "The <b>Bookmark position</b> in the <b>Side Bar</b> became more subtle",
                id: 295,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Avoid Bookmarks from being toggled in the new Search Editor",
                id: 279,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({
            kind: ChangeLogKind.VERSION,
            detail: { releaseNumber: "11.1.0", releaseDate: "April 2020" }
        });

        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Adds <b>Multi cursor</b> support",
                id: 77,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Support VS Code package split",
                id: 263,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Support <b>ThemeIcon</b>",
                id: 269,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Support Extension View Context Menu",
                id: 270,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({
            kind: ChangeLogKind.VERSION,
            detail: { releaseNumber: "11.0.0", releaseDate: "February 2020" }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Adds <b>workbench.colorCustomizations</b> support",
                id: 246,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Use <b>vscode-ext-selection</b> and <b>vscode-ext-decoration</b> packages",
                id: 266,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({
            kind: ChangeLogKind.VERSION,
            detail: { releaseNumber: "10.7.0", releaseDate: "January 2020" }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Adds hover buttons for File and Bookmarks in Side Bar",
                id: 258,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Adds relative path next to the filename in Side Bar",
                id: 236,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Renew iconography to match new VS Code identity",
                id: 231,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Shrink installation size",
                id: 190,
                kind: IssueKind.Issue
            }
        });

        return changeLog;
    }

    public provideSponsors(): Sponsor[] {
        const sponsors: Sponsor[] = [];
        const sponsorCodeStream: Sponsor = <Sponsor>{
            title: "Try Codestream",
            link: "https://sponsorlink.codestream.com/?utm_source=vscmarket&utm_campaign=bookmarks&utm_medium=banner",
            image: "https://alt-images.codestream.com/codestream_logo_bookmarks.png",
            width: 35,
            message: `<p>Discussing code is now as easy as highlighting a block and typing a comment right 
                      from your IDE. Take the pain out of code reviews and improve code quality.</p>`,
            extra:
                `<a title="Try CodeStream" href="https://sponsorlink.codestream.com/?utm_source=vscmarket&utm_campaign=bookmarks&utm_medium=banner">
                 Try it free</a>`
        };
        sponsors.push(sponsorCodeStream);
        return sponsors;
    }

}