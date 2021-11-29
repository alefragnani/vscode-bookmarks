/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { ExtensionContext } from "vscode";
import { HelpAndFeedbackView, Link, StandardLinksProvider, ProvideFeedbackLink, Command } from "vscode-ext-help-and-feedback-view";

export function registerHelpAndFeedbackView(context: ExtensionContext) {
  const items = new Array<Link | Command>();
  const predefinedProvider = new StandardLinksProvider('alefragnani.Bookmarks');
  items.push(predefinedProvider.getGetStartedLink());
  items.push(new ProvideFeedbackLink('bookmarks'));
  items.push(predefinedProvider.getReviewIssuesLink());
  items.push(predefinedProvider.getReportIssueLink());
  items.push({
    icon: 'heart',
    title: 'Support',
    command: 'bookmarks.supportBookmarks'
  });
  new HelpAndFeedbackView(context, "bookmarksHelpAndFeedback", items);
}