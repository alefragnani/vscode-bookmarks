/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands, env, l10n, MessageItem, Uri, window } from "vscode";
import { Container } from "../../vscode-bookmarks-core/src/container";

export function registerSupportBookmarks() {
  Container.context.subscriptions.push(commands.registerCommand("bookmarks.supportBookmarks", async () => {
    const actions: MessageItem[] = [
      { title: l10n.t('Become a Sponsor') },
      { title: l10n.t('Donate via PayPal') }
    ];
    const option = await window.showInformationMessage(l10n.t(`While Bookmarks is offered for free, if you find it useful, 
        please consider supporting it. Thank you!`), ...actions);
    let uri: Uri;
    if (option === actions[ 0 ]) {
      uri = Uri.parse('https://github.com/sponsors/alefragnani');
    }
    if (option === actions[ 1 ]) {
      uri = Uri.parse('https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted');
    }
    if (uri) {
      await env.openExternal(uri);
    }
  }));
}
