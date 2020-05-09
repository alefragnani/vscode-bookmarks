/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:max-line-length
import { ChangeLogItem, ChangeLogKind, ContentProvider, Header, Image, Sponsor } from "../../vscode-whats-new/src/ContentProvider";

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
        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "11.2.0", releaseDate: "May 2020" } });
        changeLog.push({
            kind: ChangeLogKind.NEW, detail: {
                message: `Adds <b>Label suggestion</b> based on selection 
                        (<a title=\"Open Issue #239\" 
                            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/239\">
                            Issue #239</a>)`}
        });
        changeLog.push({
            kind: ChangeLogKind.NEW, detail: {
                message: `<b>Side bar</b> welcome message 
                        (<a title=\"Open Issue #284\" 
                            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/284\">
                            Issue #284</a>)`}
        });
        changeLog.push({
            kind: ChangeLogKind.CHANGED, detail: {
                message: `The <b>Bookmark position</b> in the <b>Side Bar</b> became more subtle 
                        (<a title=\"Open Issue #295\" 
                            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/295\">
                            Issue #295</a>)`}
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED, detail: {
                message: `Avoid Bookmarks from being toggled in the new Search Editor 
                        (<a title=\"Open Issue #279\" 
                            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/279\">
                            Issue #279</a>)</b>`}
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "11.1.0", releaseDate: "April 2020" } });

        changeLog.push({
            kind: ChangeLogKind.NEW, detail: {
                message: `Adds <b>Multi cursor</b> support 
                        (<a title=\"Open Issue #77\" 
                            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/77\">
                            Issue #77</a>)`}});

        changeLog.push({kind: ChangeLogKind.VERSION, detail: { releaseNumber: "11.0.0", releaseDate: "February 2020"} });
        changeLog.push({kind: ChangeLogKind.NEW, detail: {
            message: `Adds <b>workbench.colorCustomizations</b> support 
                    (<a title=\"Open Issue #246\" 
                        href=\"https://github.com/alefragnani/vscode-bookmarks/issues/246\">
                        Issue #246</a>)`}});

        changeLog.push({kind: ChangeLogKind.VERSION, detail: { releaseNumber: "10.7.0", releaseDate: "January 2020"} });
        changeLog.push({kind: ChangeLogKind.NEW, detail: {
            message: `Adds hover buttons for File and Bookmarks in Side Bar 
                    (<a title=\"Open Issue #258\" 
                        href=\"https://github.com/alefragnani/vscode-bookmarks/issues/258\">
                        Issue #258</a>)</b>`}});
        changeLog.push({kind: ChangeLogKind.NEW, detail: {
            message: `Adds relative path next to the filename in Side Bar
                    (<a title=\"Open Issue #236\" 
                        href=\"https://github.com/alefragnani/vscode-bookmarks/issues/236\">
                        Issue #236</a>)</b>`}});

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
        return sponsors
    }

}