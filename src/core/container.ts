/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { ExtensionContext } from "vscode";

export class Container {
    private static _extContext: ExtensionContext;
  
    public static get context(): ExtensionContext {
      return this._extContext;
    }
  
    public static set context(ec: ExtensionContext) {
      this._extContext = ec;
    }
}
  