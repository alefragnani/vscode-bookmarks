/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:max-line-length
import { ChangeLogItem, ChangeLogKind, ContentProvider, Header, Image, Sponsor, IssueKind, SupportChannel, SocialMediaProvider, SponsorProvider } from "../../vscode-whats-new/src/ContentProvider";

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

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.3.0", releaseDate: "April 2022" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "New setting to decide if should delete bookmark if associated line is deleted",
                id: 503,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Allow customization of bookmark color (fill and border)",
                id: 445,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Bookmarks being lost on file renames",
                id: 529,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.2.4", releaseDate: "January 2022" } });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: "Update Tabnine URL"
        });   

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.2.3", releaseDate: "January 2022" } });
        // changeLog.push({
        //     kind: ChangeLogKind.NEW,
        //     detail: {
        //         message: "New setting to keep bookmarks on line delete",
        //         id: 503,
        //         kind: IssueKind.Issue
        //     }
        // });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: "<b>Duckly</b> becomes a Sponsor"
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.2.2", releaseDate: "September 2021" } });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: "Update Tabnine URL"
        });        

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.2.1", releaseDate: "August 2021" } });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Remove unnecessary files from extension package",
                id: 465,
                kind: IssueKind.Issue
            }
        });       

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.2.0", releaseDate: "August 2021" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "New <b>Sticky Engine</b> with improved support to Formatters, Multi-cursor and Undo operations",
                id: 463,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "<b>View as Tree</b> and <b>View as List</b> options in Side Bar",
                id: 453,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "New command to Hide/Show bookmark position in Side Bar",
                id: 143,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Updated translations",
                id: 464,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Bookmark positions didn't update after pasting content above",
                id: 446,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Bookmark positions didn't update after adding empty lines above",
                id: 457,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Bookmark moving off original line",
                id: 168,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Undo messes up bookmarks",
                id: 116,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "<b>Toggle</b> command in Notebook cells causes duplicate editor to be opened",
                id: 456,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "<b>Toggle</b> command causes exiting diff editor",
                id: 440,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.1.0", releaseDate: "May 2021" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Support <b>Virtual Workspaces</b>",
                id: 432,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Support <b>Workspace Trust</b>",
                id: 430,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Return to line/column when cancel List or List from All Files",
                id: 386,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Update pt-br translation",
                id: 376,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Latest bookmark could not be removed",
                id: 422,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Minor grammatical and spelling issue",
                id: 388,
                kind: IssueKind.PR,
                kudos: "@derekpock"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Security Alert: lodash",
                id: 433,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Security Alert: ssri",
                id: 425,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Security Alert: y18n",
                id: 418,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Security Alert: elliptic",
                id: 408,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.0.4", releaseDate: "March 2021" } });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Bookmarks on deleted/missing files breaks jumping",
                id: 390,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Toggling bookmarks on Untitled documents does not work",
                id: 391,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.0.3", releaseDate: "March 2021" } });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: "Update Tabnine URL"
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.0.2", releaseDate: "February 2021" } });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Command `bookmarks.toggle` not found - loading empty workspace with random files",
                id: 395,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.0.1", releaseDate: "February 2021" } });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Command `bookmarks.toggle` not found - extension was not activated",
                id: 387,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "13.0.0", releaseDate: "February 2021" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Support <b>Remote Development</b>",
                id: 230,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Improvements on <b>multi-root</b> support",
                id: 193,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Group bookmarks by folder on multi-root in Side Bar",
                id: 249,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Cross-platform support",
                id: 205,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Do not show welcome page if installed by Settings Sync",
                id: 377,
                kind: IssueKind.Issue
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

export class BookmarksSponsorProvider implements SponsorProvider {
    public provideSponsors(): Sponsor[] {
        const sponsors: Sponsor[] = [];
        const sponsorCodeStream: Sponsor = <Sponsor>{
            title: "Learn more about Codestream",
            link: "https://sponsorlink.codestream.com/?utm_source=vscmarket&utm_campaign=bookmarks&utm_medium=banner",
            image: {
                dark: "https://alt-images.codestream.com/codestream_logo_bookmarks.png",
                light: "https://alt-images.codestream.com/codestream_logo_bookmarks.png"
            },
            width: 35,
            message: `<p>Eliminate context switching and costly distractions. 
                Create and merge PRs and perform code reviews from inside your 
                IDE while using jump-to-definition, your keybindings, and other IDE favorites.</p>`,
            extra:
                `<a title="Learn more about CodeStream" href="https://sponsorlink.codestream.com/?utm_source=vscmarket&utm_campaign=bookmarks&utm_medium=banner">
                Learn more</a>`
        };
        sponsors.push(sponsorCodeStream);
        return sponsors;
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