## [0.19.1] - 2018-04-29
### Fixed 
- (Again) Avoid empty `.vscode\bookmarks.json` file when ther is no bookmark (issue [#95](https://github.com/alefragnani/vscode-bookmarks/issues/95))
- Error while saving bookmarks for _Untitled_ files (issue [#106](https://github.com/alefragnani/vscode-bookmarks/issues/106))

## [0.19.0] - 2018-04-22
### Changed
- TreeView visibility now also depends if you have bookmarks in project (issue [#103](https://github.com/alefragnani/vscode-bookmarks/issues/103))

### Fixed 
- Avoid empty `.vscode\bookmarks.json` file when ther is no bookmark (issue [#95](https://github.com/alefragnani/vscode-bookmarks/issues/95))

## [0.18.2] - 2018-03-08
### Fixed
- Error activating extension without workspace (folder) open (issue [#94](https://github.com/alefragnani/vscode-bookmarks/issues/94))

## [0.18.1] - 2018-01-02
### Fixed
- Re-enable `Toggle` command to put documents on _non preview mode_ (Thanks to @muellerkyle [PR #90](https://github.com/alefragnani/vscode-bookmarks/pull/90))

## [0.18.0] - 2017-11-12
### Added
- Multi-root support (issue [#82](https://github.com/alefragnani/vscode-bookmarks/issues/82))

## [0.17.0] - 2017-10-21
### Added
- Treeview is now Optional (issue [#83](https://github.com/alefragnani/vscode-bookmarks/issues/83))

## [0.16.0] - 2017-08-28
### Added
- Bookmarks TreeView (issue [#64](https://github.com/alefragnani/vscode-bookmarks/issues/64))

## [0.15.2] - 2017-06-17
### Fixed
- Toggling bookmark on Center/Right editors were opening the same file on Left editor (issue [#74](https://github.com/alefragnani/vscode-bookmarks/issues/74))

## [0.15.1] - 2017-05-27
### Fixed
- Error opening files outside the project in `List from All Files`  (issue [#72](https://github.com/alefragnani/vscode-bookmarks/issues/72))

## [0.15.0] - 2017-05-23
### Added
- Support Retina Displays (issue [#70](https://github.com/alefragnani/vscode-bookmarks/issues/70))
- `Toggle` command now put documents on _non preview mode_ (issue [#30](https://github.com/alefragnani/vscode-bookmarks/issues/30))

### Fixed
- `List from All Files` command not working since VS Code 1.12 (issue [#69](https://github.com/alefragnani/vscode-bookmarks/issues/69))

### Changed
- **TypeScript** and **VS Code engine** updated
- Source code moved to `src` folder

## [0.14.1] - 2017-04-12
### Fixed
- Bookmarks saved in Project were not working fine for _non-Windows_ OS (Thanks to @fzzr- [PR #67](https://github.com/alefragnani/vscode-bookmarks/pull/67))

## [0.14.0] - 2017-04-11
### Added
- Sticky bookmarks are now moved in _indented_ lines (issue [#62](https://github.com/alefragnani/vscode-bookmarks/issues/62))

## [0.13.0] - 2017-04-02
### Added
- Bookmarks can now be saved in the project (inside `.vscode` folder)

### Changed
- Bookmarks are now _always_ Sticky

## [0.12.0] - 2017-05-05
### Fixed
- Sticky Bookmarks fails with `trimAutoWhitespace` set to `true` (issue [#35](https://github.com/alefragnani/vscode-bookmarks/issues/35))
- Sticky Bookmarks fails with unstaged files (issue [#40](https://github.com/alefragnani/vscode-bookmarks/issues/40))

## [0.11.0] - 2017-02-12
### Added
- Storage optimizations (issue [#51](https://github.com/alefragnani/vscode-bookmarks/issues/51))

### Fixed
- `List from All Files` not working if a project file has been removed (issue [#50](https://github.com/alefragnani/vscode-bookmarks/issues/50))

### Changed
- Enabled **TSLint**

## [0.10.2] - 2017-01-10
### Fixed
- `List from All Files` command was closing active file when canceling navigation (issue [#46](https://github.com/alefragnani/vscode-bookmarks/issues/46))

## [0.10.1] - 2016-12-03
### Fixed
- Bookmarks becomes invalid when documents are modified outside VSCode (issue [#33](https://github.com/alefragnani/vscode-bookmarks/issues/33))

## [0.10.0] - 2016-10-22
### Added
- Now you can select lines and text block via bookmarks
- Command to select all bookmarked lines (`Bookmarks (Selection): Select Lines`)
- Command to expand selection to next bookmark (`Bookmarks (Selection): Expand Selection to Next`)
- command to expand selection to previous bookmark (`Bookmarks (Selection): Expand Selection to Previous`)
- Command to shrink selection between bookmarks (`Bookmarks (Selection): Shrink Selection`)

## [0.9.2] - 2016-09-19
### Fixed
- Bookmarks missing in _Insider release 1.6.0_ (issue [#34](https://github.com/alefragnani/vscode-bookmarks/issues/34))

## [0.9.1] - 2016-08-31
### Fixed
- Bookmarks missing on C/C++ files (PR [#32](https://github.com/alefragnani/vscode-bookmarks/pull/32) - kudos to @tlemo)

## [0.9.0] - 2016-07-13
### Added
- Commands added to Context Menus (Editor and Title) (issue [#16](https://github.com/alefragnani/vscode-bookmarks/issues/16))

## [0.8.0] - 2016-06-02
### Added
- Command to list bookmarks from all files (`Bookmarks: List from All Files`)
- Command to clear bookmarks from all files (`Bookmarks: Clear from All Files`)

## [0.7.2] - 2016-06-28
### Fixed
- Cannot jump to bookmark when scrolling with mouse (issue [#26](https://github.com/alefragnani/vscode-bookmarks/issues/26))

## [0.7.1] - 2016-05-12
### Fixed
- Remove extension activation log (issue [#25](https://github.com/alefragnani/vscode-bookmarks/issues/25))

## [0.7.0] - 2016-04-12
### Added
- Sticky Bookmarks (kudos to @Terminux)

## [0.6.0] - 2016-03-08
### Added
- Ability to navigate to bookmarks in all files
- Navigate through all files

### Fixed
- Error when there is no active file (issue [#18](https://github.com/alefragnani/vscode-bookmarks/issues/18))

## [0.5.0] - 2016-02-20
### Added
- Bookmarks are now also rendered in the overview ruler

## [0.4.0] - 2016-02-04
### Added
- Command to list all bookmarks from the current file (`Bookmarks: List`)

## [0.3.0] - 2016-01-16
### Added
* License file

## [0.2.0] - 2015-11-15
### Added
- Setting to decide if bookmarks must be saved in project (`bookmarks.saveBookmarksInProject`
- Setting to choose another icon for bookmarks (`bookmarks.gutterIconPath`)

## [0.1.1] - 2015-11-18

* Initial release