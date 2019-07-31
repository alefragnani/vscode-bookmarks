## [10.5.0] - 2019-??-??
### Added
- Localization support - Portuguese (Brazil)
- Remote Development support for configurations - (issue [#219](https://github.com/alefragnani/vscode-bookmarks/issues/219))

### Fixed
- Activation error for "No-Folders Workspace" scenario (issue [#212](https://github.com/alefragnani/vscode-bookmarks/issues/212))

## [10.4.4] - 2019-05-29
### Fixed
- Security Alert: tar

## [10.4.3] - 2019-04-10
### Fixed
- Typing delay when `SaveBookmarksInProject` is enabled (issue [#202](https://github.com/alefragnani/vscode-bookmarks/issues/202))

## [10.4.2] - 2019-04-05
### Fixed
- Deprecate `bookmarks.treeview.visible` setting. (issue [#201](https://github.com/alefragnani/vscode-bookmarks/issues/201))

## [10.4.0] - 2019-03-26
### Added
- New Setting to hide Context Menu commands (Thanks to @bfranklyn [PR #189](https://github.com/alefragnani/vscode-bookmarks/pull/189))

### Fixed
- Selection issue when using `Move Line Up` command (issue [#186](https://github.com/alefragnani/vscode-bookmarks/issues/186))

## [10.3.0] - 2019-03-14
### Added
- Localization support - zh-cn (Thanks to @axetroy [PR #181](https://github.com/alefragnani/vscode-bookmarks/pull/181))

### Fixed
- What's New page broken in VS Code 1.32 due to CSS API changes

## [10.2.2] - 2019-02-01
### Fixed
- Error in _clean install_ (issue [#178](https://github.com/alefragnani/vscode-bookmarks/issues/178))

## [10.2.1] - 2019-01-31
### Fixed
- Update CodeStream logo

## [10.2.0] - 2019-01-17
### Added
- `Edit Label` command in the **Side Bar** (issue [#146](https://github.com/alefragnani/vscode-bookmarks/issues/146))

## [10.1.0] - 2019-01-08
### Added
- Localization support - Russian (Thanks to @Inter-Net-Pro [PR #151](https://github.com/alefragnani/vscode-bookmarks/pull/151))

### Fixed
- Wrong bookmark position on comment lines (issue [#108](https://github.com/alefragnani/vscode-bookmarks/issues/108) - Thanks to @edgardmessias [PR #136](https://github.com/alefragnani/vscode-bookmarks/pull/136))
- Workaround for formatters, using a new setting `bookmarks.useWorkaroundForFormatters` (issue [#118](https://github.com/alefragnani/vscode-bookmarks/issues/118#issuecomment-442686987))

## [10.0.0] - 2018-11-27
### Added
- What's New

## [9.3.0] - 2018-11-17
### Added
- New Setting to choose background color of bookmarked lines (Thanks to @edgardmessias [PR #133](https://github.com/alefragnani/vscode-bookmarks/pull/133))
- New Setting to choose how to wrap navigation around at the first and last bookmarks (Thanks to @miqh [PR #155](https://github.com/alefragnani/vscode-bookmarks/pull/155))
- Commands added to Context Menus (Editor) (Thanks to @miqh [PR #154](https://github.com/alefragnani/vscode-bookmarks/pull/154))

## [9.2.0] - 2018-11-06
### Added
- CodeStream becomes a Sponsor

## [9.1.0] - 2018-09-15
### Added
- Patreon button

## [9.0.3] - 2018-07-31
### Fixed
- Bookmark jumping to `column 0` was not working (issue [#135](https://github.com/alefragnani/vscode-bookmarks/issues/135))
- Toggle Labeled Bookmark on already bookmarked line glitch (issue [#138](https://github.com/alefragnani/vscode-bookmarks/issues/138))
- Adding bookmark on empty line was using `undefined` in line preview (issue [#134](https://github.com/alefragnani/vscode-bookmarks/issues/134))

## [9.0.2] - 2018-07-24
### Fixed
- **Side Bar** was not loading - infinite spinning (issue [#127](https://github.com/alefragnani/vscode-bookmarks/issues/127))

## [9.0.1] - 2018-07-23
### Fixed
- `bookmarks.navigateThroughAllFiles` setting was no longer working (Thanks to @lega11 [PR #129](https://github.com/alefragnani/vscode-bookmarks/pull/129) and @edgardmessias [PR #130](https://github.com/alefragnani/vscode-bookmarks/pull/130))

## [9.0.0] - 2018-07-13
### Added
- Bookmarks **Side Bar** (issue [#109](https://github.com/alefragnani/vscode-bookmarks/issues/109))
- Support Labeled Bookmarks (issue [#76]
(https://github.com/alefragnani/vscode-bookmarks/issues/76))
- Support Column position in Bookmarks (issue [#36](https://github.com/alefragnani/vscode-bookmarks/issues/36))
- Use file icon from themes in TreeView (Thanks to @vbfox [PR #112](https://github.com/alefragnani/vscode-bookmarks/pull/112))
- Trim leading whitespaces in bookmarks list (issue [#121](https://github.com/alefragnani/vscode-bookmarks/issues/121))
- New Version Numbering based on `semver`

## [0.19.1 - 8.1.1] - 2018-04-29
### Fixed 
- (Again) Avoid empty `.vscode\bookmarks.json` file when ther is no bookmark (issue [#95](https://github.com/alefragnani/vscode-bookmarks/issues/95))
- Error while saving bookmarks for _Untitled_ files (issue [#106](https://github.com/alefragnani/vscode-bookmarks/issues/106))

## [0.19.0 - 8.1.0] - 2018-04-22
### Changed
- TreeView visibility now also depends if you have bookmarks in project (issue [#103](https://github.com/alefragnani/vscode-bookmarks/issues/103))

### Fixed 
- Avoid empty `.vscode\bookmarks.json` file when ther is no bookmark (issue [#95](https://github.com/alefragnani/vscode-bookmarks/issues/95))

## [0.18.2 - 8.0.2] - 2018-03-08
### Fixed
- Error activating extension without workspace (folder) open (issue [#94](https://github.com/alefragnani/vscode-bookmarks/issues/94))

## [0.18.1 - 8.0.1] - 2018-01-02
### Fixed
- Re-enable `Toggle` command to put documents on _non preview mode_ (Thanks to @muellerkyle [PR #90](https://github.com/alefragnani/vscode-bookmarks/pull/90))

## [0.18.0 - 8.0.0] - 2017-11-12
### Added
- Multi-root support (issue [#82](https://github.com/alefragnani/vscode-bookmarks/issues/82))

## [0.17.0 - 7.1.0] - 2017-10-21
### Added
- Treeview is now Optional (issue [#83](https://github.com/alefragnani/vscode-bookmarks/issues/83))

## [0.16.0 - 7.0.0] - 2017-08-28
### Added
- Bookmarks TreeView (issue [#64](https://github.com/alefragnani/vscode-bookmarks/issues/64))

## [0.15.2 - 6.0.2] - 2017-06-17
### Fixed
- Toggling bookmark on Center/Right editors were opening the same file on Left editor (issue [#74](https://github.com/alefragnani/vscode-bookmarks/issues/74))

## [0.15.1 - 6.0.1] - 2017-05-27
### Fixed
- Error opening files outside the project in `List from All Files`  (issue [#72](https://github.com/alefragnani/vscode-bookmarks/issues/72))

## [0.15.0 - 6.0.0] - 2017-05-23
### Added
- Support Retina Displays (issue [#70](https://github.com/alefragnani/vscode-bookmarks/issues/70))
- `Toggle` command now put documents on _non preview mode_ (issue [#30](https://github.com/alefragnani/vscode-bookmarks/issues/30))

### Fixed
- `List from All Files` command not working since VS Code 1.12 (issue [#69](https://github.com/alefragnani/vscode-bookmarks/issues/69))

### Changed
- **TypeScript** and **VS Code engine** updated
- Source code moved to `src` folder

## [0.14.1 - 5.1.1] - 2017-04-12
### Fixed
- Bookmarks saved in Project were not working fine for _non-Windows_ OS (Thanks to @fzzr- [PR #67](https://github.com/alefragnani/vscode-bookmarks/pull/67))

## [0.14.0 - 5.1.0] - 2017-04-11
### Added
- Sticky bookmarks are now moved in _indented_ lines (issue [#62](https://github.com/alefragnani/vscode-bookmarks/issues/62))

## [0.13.0 - 5.0.0] - 2017-04-02
### Added
- Bookmarks can now be saved in the project (inside `.vscode` folder)

### Changed
- Bookmarks are now _always_ Sticky

## [0.12.0 - 4.0.1] - 2017-05-05
### Fixed
- Sticky Bookmarks fails with `trimAutoWhitespace` set to `true` (issue [#35](https://github.com/alefragnani/vscode-bookmarks/issues/35))
- Sticky Bookmarks fails with unstaged files (issue [#40](https://github.com/alefragnani/vscode-bookmarks/issues/40))

## [0.11.0 - 4.0.0] - 2017-02-12
### Added
- Storage optimizations (issue [#51](https://github.com/alefragnani/vscode-bookmarks/issues/51))

### Fixed
- `List from All Files` not working if a project file has been removed (issue [#50](https://github.com/alefragnani/vscode-bookmarks/issues/50))

### Changed
- Enabled **TSLint**

## [0.10.2 - 3.3.2] - 2017-01-10
### Fixed
- `List from All Files` command was closing active file when canceling navigation (issue [#46](https://github.com/alefragnani/vscode-bookmarks/issues/46))

## [0.10.1 - 3.3.1] - 2016-12-03
### Fixed
- Bookmarks becomes invalid when documents are modified outside VSCode (issue [#33](https://github.com/alefragnani/vscode-bookmarks/issues/33))

## [0.10.0 - 3.3.0] - 2016-10-22
### Added
- Now you can select lines and text block via bookmarks
- Command to select all bookmarked lines (`Bookmarks (Selection): Select Lines`)
- Command to expand selection to next bookmark (`Bookmarks (Selection): Expand Selection to Next`)
- command to expand selection to previous bookmark (`Bookmarks (Selection): Expand Selection to Previous`)
- Command to shrink selection between bookmarks (`Bookmarks (Selection): Shrink Selection`)

## [0.9.2 - 3.2.2] - 2016-09-19
### Fixed
- Bookmarks missing in _Insider release 1.6.0_ (issue [#34](https://github.com/alefragnani/vscode-bookmarks/issues/34))

## [0.9.1 - 3.2.1] - 2016-08-31
### Fixed
- Bookmarks missing on C/C++ files (PR [#32](https://github.com/alefragnani/vscode-bookmarks/pull/32) - kudos to @tlemo)

## [0.9.0 - 3.2.0] - 2016-07-13
### Added
- Commands added to Context Menus (Editor and Title) (issue [#16](https://github.com/alefragnani/vscode-bookmarks/issues/16))

## [0.8.0 - 3.1.0] - 2016-07-02
### Added
- Command to list bookmarks from all files (`Bookmarks: List from All Files`)
- Command to clear bookmarks from all files (`Bookmarks: Clear from All Files`)

## [0.7.2 - 3.0.2] - 2016-06-28
### Fixed
- Cannot jump to bookmark when scrolling with mouse (issue [#26](https://github.com/alefragnani/vscode-bookmarks/issues/26))

## [0.7.1 - 3.0.1] - 2016-05-12
### Fixed
- Remove extension activation log (issue [#25](https://github.com/alefragnani/vscode-bookmarks/issues/25))

## [0.7.0 - 3.0.0] - 2016-04-12
### Added
- Sticky Bookmarks (kudos to @Terminux)

## [0.6.0 - 2.2.0] - 2016-03-08
### Added
- Ability to navigate to bookmarks in all files
- Navigate through all files

### Fixed
- Error when there is no active file (issue [#18](https://github.com/alefragnani/vscode-bookmarks/issues/18))

## [0.5.0 - 2.1.0] - 2016-02-20
### Added
- Bookmarks are now also rendered in the overview ruler

## [0.4.0 - 2.0.0] - 2016-02-04
### Added
- Command to list all bookmarks from the current file (`Bookmarks: List`)

## [0.3.0 - 1.2.0] - 2016-01-16
### Added
* License file

## [0.2.0 - 1.1.0] - 2015-11-15
### Added
- Setting to decide if bookmarks must be saved in project (`bookmarks.saveBookmarksInProject`
- Setting to choose another icon for bookmarks (`bookmarks.gutterIconPath`)

## [0.1.1 - 1.0.0] - 2015-11-18

* Initial release