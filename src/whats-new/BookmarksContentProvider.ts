/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:max-line-length
import { ChangeLogItem, ChangeLogKind, ContentProvider, Header, Image, Sponsor } from "../../vscode-whats-new/src/ContentProvider";

export class WhatsNewBookmarksContentProvider implements ContentProvider {

    public provideHeader(logoUrl: string): Header {
        return <Header> {logo: <Image> {src: logoUrl, height: 50, width: 50}, 
            message: `<b>Bookmarks</b> helps you to navigate in your code, <b>moving</b> 
            between important positions easily and quickly. No more need 
            to <i>search for code</i>. It also supports a set of <b>selection</b>
            commands, which allows you to select bookmarked lines and regions between
            lines.`};
    }

    public provideChangeLog(): ChangeLogItem[] {
        const changeLog: ChangeLogItem[] = [];
        changeLog.push({kind: ChangeLogKind.NEW, message: "Adds an all-new <b>Side Bar</b>"});
        changeLog.push({kind: ChangeLogKind.NEW, message: "Adds <b>Column Position</b> and <b>Label</b> support"});
        changeLog.push({kind: ChangeLogKind.NEW, message: `Adds <b>Localization</b> support - <b>Russian</b>, 
            <b>Chinese (Simplified)</b> and <b>Portuguese (Brazil)</b>`});
        changeLog.push({kind: ChangeLogKind.NEW, message: `Show only filename in Side Bar - (<a title=\"Open Issue #149\" 
            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/149\">
            Issue #154</a>)</b>`});
        changeLog.push({kind: ChangeLogKind.NEW, message: `Adds <b>Collapse All</b> command in the Side Bar (<a title=\"Open Issue #92\" 
            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/92\">
            PR #92</a>)`});
        changeLog.push({kind: ChangeLogKind.NEW, message: `Adds Setting to start Side Bar expanded (<a title=\"Open Issue #176\" 
                href=\"https://github.com/alefragnani/vscode-bookmarks/issues/176\">
                PR #176</a>)`});
        changeLog.push({kind: ChangeLogKind.CHANGED, message: `The <b>Expand Selection...</b> commands now works even if the file has only one Bookmark (<a title=\"Open Issue #120\" 
            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/120\">
            PR #120</a>)`});
        changeLog.push({kind: ChangeLogKind.FIXED, message: `Activation error for "No-Folders Workspace" scenario (<a title=\"Open Issue #212\" 
            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/212\">
            Issue #212</a>)`});
        changeLog.push({kind: ChangeLogKind.FIXED, message: `Typing delay when SaveBookmarksInProject is enabled (<a title=\"Open Issue #202\" 
            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/202\">
            Issue #202</a>)`});
        changeLog.push({kind: ChangeLogKind.FIXED, message: `Workaround for formatters, using a new setting (<a title=\"Open Issue #118\" 
            href=\"https://github.com/alefragnani/vscode-bookmarks/issues/118\">
            Issue #118</a>)</b>`});
        return changeLog;
    }

    public provideSponsors(): Sponsor[] {
        const sponsors: Sponsor[] = [];
        const sponsorCodeStream: Sponsor = <Sponsor> {
            title: "Try Codestream",
            link: "https://codestream.com/?utm_source=vscmarket&utm_medium=banner&utm_campaign=bookmarks",
            image: "https://alt-images.codestream.com/codestream_logo_bookmarks.png",
            width: 35,
            message: `<p>Discuss, review, and share code with your team in VS Code. Links discussions about 
                code to your code. Integrates w/ Slack, Jira, Trello, and Live Share.</p>`,
            extra: 
                `<a title="Try CodeStream" href="https://codestream.com/?utm_source=vscmarket&utm_medium=banner&utm_campaign=bookmarks">
                 Try it free</a>` 
        };
        sponsors.push(sponsorCodeStream);
        return sponsors
    }
   
}