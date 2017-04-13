# Changelog

## Version 0.14.1

* **Fix:** Bookmarks saved in Project were not working fine for _non-Windows_ OS (Thanks to @fzzr- [PR #67](https://github.com/alefragnani/vscode-bookmarks/pull/67))

## Version 0.14.0

* **New:** Sticky bookmarks are now moved in _indented_ lines (issue [#62](https://github.com/alefragnani/vscode-bookmarks/issues/62))

## Version 0.13.0

* **New Setting:** Bookmarks can now be saved in the project (inside `.vscode` folder)
* **Removed Setting:** Bookmarks are now _always_ Sticky

## Version 0.12.0

* **Fix:** Sticky Bookmarks fails with `trimAutoWhitespace` set to `true` (issue [#35](https://github.com/alefragnani/vscode-bookmarks/issues/35))
* **Fix:** Sticky Bookmarks fails with unstaged files (issue [#40](https://github.com/alefragnani/vscode-bookmarks/issues/40))

## Version 0.11.0

* **New:** Storage optimizations (issue [#51](https://github.com/alefragnani/vscode-bookmarks/issues/51))
* **Fix:** `List from All Files` not working if a project file has been removed (issue [#50](https://github.com/alefragnani/vscode-bookmarks/issues/50))
* **Internal:** Enabled **TSLint**

## Version 0.10.2

* **Fix:** `List from All Files` command was closing active file when canceling navigation (issue [#46](https://github.com/alefragnani/vscode-bookmarks/issues/46))

## Version 0.10.1

* **Fix:** Bookmarks becomes invalid when documents are modified outside VSCode (issue [#33](https://github.com/alefragnani/vscode-bookmarks/issues/33))

## Version 0.10.0

* **New**: Now you can select lines and text block via bookmarks
* **New Command:** Select Lines
* **New Command:** Expand Selection to Next
* **New Command:** Expand Selection to Previous
* **New Command:** Shrink Selection

## Version 0.9.2

* **Fix:** Bookmarks missing in _Insider release 1.6.0_ (issue [#34](https://github.com/alefragnani/vscode-bookmarks/issues/34))

## Version 0.9.1

* **Fix:** Bookmarks missing on C/C++ files (PR [#32](https://github.com/alefragnani/vscode-bookmarks/pull/32) - kudos to @tlemo)

## Version 0.9.0

* **New:** Commands added to Context Menus (Editor and Title) (issue [#16](https://github.com/alefragnani/vscode-bookmarks/issues/16))

## Version 0.8.0

* **New Command:** List Bookmarks from all files
* **New Command:** Clear Bookmarks from all files

## Version 0.7.2

* **Fix:** Cannot jump to bookmark when scrolling with mouse (issue [#26](https://github.com/alefragnani/vscode-bookmarks/issues/26))

## Version 0.7.1

* **Fix:** Remove extension activation log (issue [#25](https://github.com/alefragnani/vscode-bookmarks/issues/25))

## Version 0.7.0

* **New Setting:** Sticky Bookmarks (kudos to @Terminux)

## Version 0.6.0

* **New:** Abitity to navigate to bookmarks in all files
* **New Setting:** Navigate through all files
* **Fix:** Error when there is no active file (issue [#18](https://github.com/alefragnani/vscode-bookmarks/issues/18))

## Version 0.5.0

* **New:** Bookmarks are also rendered in the overview ruler

## Version 0.4.0

* **New Command:** List all bookmarks from the current file

## Version 0.3.0

* License updated

## Version 0.2.0

* **New Setting:** Save bookmarks between sessions
* **New Setting:** Change the bookmark icon

## Version 0.1.1

* Initial release