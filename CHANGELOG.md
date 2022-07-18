## [13.3.1] - 2022-07-18
### Internal
- Add GitHub Sponsors support (PR [#544](https://github.com/alefragnani/vscode-bookmarks/pull/544))

## [13.3.0] - 2022-05-08
### Added
- New setting to decide if should delete bookmark if associated line is deleted (issue [#503](https://github.com/alefragnani/vscode-bookmarks/issues/503))
- Allow customization of bookmark icon - border and fill colors (issue [#445](https://github.com/alefragnani/vscode-bookmarks/issues/445))

### Fixed
- Bookmarks being lost on file renames (issue [#529](https://github.com/alefragnani/vscode-bookmarks/issues/529))

## [13.2.4] - 2022-02-23
### Internal
- Update Tabnine URL

## [13.2.3] - 2022-02-08
### Internal
- Duckly becomes a Sponsor

## [13.2.2] - 2021-10-08
### Internal
- Update Tabnine URL

## [13.2.1] - 2021-09-05
### Internal
- Remove unnecessary files from extension package (issue [#465](https://github.com/alefragnani/vscode-bookmarks/issues/465))

## [13.2.0] - 2021-09-05
### Added
- New **Sticky Engine** with improved support to Formatters, Multi-cursor and Undo operations (issue [#463](https://github.com/alefragnani/vscode-bookmarks/issues/463))
- `View as Tree` and `View as List` options in Side Bar (issue [#453](https://github.com/alefragnani/vscode-bookmarks/issues/453))
- New command to Hide/Show bookmark position in Side Bar (issue [#143](https://github.com/alefragnani/vscode-bookmarks/issues/143))
- Updated translations (issue [#464](https://github.com/alefragnani/vscode-bookmarks/issues/464))

### Fixed
- Bookmark positions didn't update after pasting content above (issue [#446](https://github.com/alefragnani/vscode-bookmarks/issues/446))
- Bookmark positions didn't update after adding empty lines above (issue [#457](https://github.com/alefragnani/vscode-bookmarks/issues/457))
- Bookmark moving off original line (issue [#168](https://github.com/alefragnani/vscode-bookmarks/issues/168))
- Undo messes up bookmarks (issue [#116](https://github.com/alefragnani/vscode-bookmarks/issues/116))
- `Toggle` command in Notebook cells causes duplicate editor to be opened (issue [#456](https://github.com/alefragnani/vscode-bookmarks/issues/456))
- `Toggle` command causes exiting diff editor (issue [#440](https://github.com/alefragnani/vscode-bookmarks/issues/440))

## [13.1.0] - 2021-06-10
### Added
- Support **Virtual Workspaces** (issue [#432](https://github.com/alefragnani/vscode-bookmarks/issues/432))
- Support **Workspace Trust** (issue [#430](https://github.com/alefragnani/vscode-bookmarks/issues/430))
- Return to line/column when cancel List or List from All Files (issue [#386](https://github.com/alefragnani/vscode-bookmarks/issues/386))
- Update pt-br translation (issue [#376](https://github.com/alefragnani/vscode-bookmarks/issues/376))

### Fixed
- Latest bookmark could not be removed (issue [#422](https://github.com/alefragnani/vscode-bookmarks/issues/422))
- Minor grammatical and spelling issue (Thanks to @derekpock [PR #388](https://github.com/alefragnani/vscode-bookmarks/pull/388))

### Internal
- Security Alert: lodash (dependabot [PR #433](https://github.com/alefragnani/vscode-bookmarks/pull/433))
- Security Alert: ssri (dependabot [PR #425](https://github.com/alefragnani/vscode-bookmarks/pull/425))
- Security Alert: y18n (dependabot [PR #418](https://github.com/alefragnani/vscode-bookmarks/pull/418))
- Security Alert: elliptic (dependabot [PR #408](https://github.com/alefragnani/vscode-bookmarks/pull/408))

## [13.0.4] - 2021-03-13
### Fixed
- Bookmarks on deleted/missing files breaks jumping (issue [#390](https://github.com/alefragnani/vscode-bookmarks/issues/390))
- Toggling bookmarks on Untitled documents does not work (issue [#391](https://github.com/alefragnani/vscode-bookmarks/issues/391))

## [13.0.3] - 2021-03-04
### Internal
- Update Tabnine URL

## [13.0.2] - 2021-02-25
### Fixed
- Command `bookmarks.toggle` not found - loading empty workspace with random files (issue [#395](https://github.com/alefragnani/vscode-bookmarks/issues/395))

## [13.0.1] - 2021-02-15
### Fixed
- Command `bookmarks.toggle` not found - extension was not activated (issue [#387](https://github.com/alefragnani/vscode-bookmarks/issues/387))

## [13.0.0] - 2021-02-13
### Added
- Support Remote Development (issue [#230](https://github.com/alefragnani/vscode-bookmarks/issues/230))
- Improvements on multi-root support (issue [#193](https://github.com/alefragnani/vscode-bookmarks/issues/193))
- Group bookmarks by folder on multi-root in Side Bar (issue [#249](https://github.com/alefragnani/vscode-bookmarks/issues/249))
- Multi-platform support (issue [#205](https://github.com/alefragnani/vscode-bookmarks/issues/205))

### Internal
- Do not show welcome message if installed by Settings Sync (issue [#377](https://github.com/alefragnani/vscode-bookmarks/issues/377))

## [12.1.4] - 2021-01-18
### Internal
- Update Tabnine URL

## [12.1.3] - 2021-01-16
### Changed
- Added new translations (Thanks to @loniceras [PR #367](https://github.com/alefragnani/vscode-bookmarks/pull/367))

### Internal
- Update Tabnine URL

## [12.1.2] - 2021-01-07
### Internal
- Update Tabnine logo

## [12.1.1] - 2021-01-07
### Internal
- Update whats-new submodule API (issue [#373](https://github.com/alefragnani/vscode-bookmarks/issues/373))
- Tabnine becomes a Sponsor

## [12.1.0] - 2020-12-23
### Added
- Support submenu for editor commands (issue [#351](https://github.com/alefragnani/vscode-bookmarks/issues/351))

### Changed
- Setting `bookmarks.navigateThroughAllFiles` is now `true` by default (issue [#102](https://github.com/alefragnani/vscode-bookmarks/issues/102))

### Internal
- Remove unnecessary files from extension package (issue [#355](https://github.com/alefragnani/vscode-bookmarks/issues/355))

## [12.0.0] - 2020-11-24
### Added
- `Open Settings` command to the Side Bar (issue [#352](https://github.com/alefragnani/vscode-bookmarks/issues/352))
- `Toggle Labeled` command to the Context Menu (Thanks to @fade2gray [PR #342](https://github.com/alefragnani/vscode-bookmarks/pull/342))

### Changed
- Switch initialization to `onStartupFinished` API (Thanks to @jasonwilliams [PR #343](https://github.com/alefragnani/vscode-bookmarks/pull/343))

### Fixed
- Clearing bookmark label through `Toggle Labeled` command leaving leading spaces (issue [#344](https://github.com/alefragnani/vscode-bookmarks/issues/344))
- Leading spaces while using Move Line Up/Down (issue [#348](https://github.com/alefragnani/vscode-bookmarks/issues/348))
- "Ghost" Bookmarks after renaming files (issue [#209](https://github.com/alefragnani/vscode-bookmarks/issues/209))

### Internal
- Use `vscode-ext-help-and-feedback` package (issue [#346](https://github.com/alefragnani/vscode-bookmarks/issues/346))

## [11.4.0] - 2020-10-16
### Added
- Support clear the bookmark label in `Toggle Labeled` and `Edit Label` commands (issue [#320](https://github.com/alefragnani/vscode-bookmarks/issues/320))

### Changed
- Localization support - zh-cn (Thanks to @loniceras [PR #327](https://github.com/alefragnani/vscode-bookmarks/pull/327))

### Fixed
- Typo in Side Bar welcome page (Thanks to @osteele [PR #316](https://github.com/alefragnani/vscode-bookmarks/pull/316))

### Internal
- Update CodeStream sponsorship details

## [11.3.1] - 2020-06-20
### Fixed
- `Open Folder` command in Welcome view not working on Windows (issue [#310](https://github.com/alefragnani/vscode-bookmarks/issues/310))
- Stars visibility on Marketplace (issue [#314](https://github.com/alefragnani/vscode-bookmarks/issues/314))

## [11.3.0] - 2020-06-15
### Added
- Auto-save bookmarks when changing `saveBookmarksInProject` setting (issue [#242](https://github.com/alefragnani/vscode-bookmarks/issues/242))

### Changed
- Internal commands can't be customisable (issue [#306](https://github.com/alefragnani/vscode-bookmarks/issues/306))

### Internal
- Migrate from TSLint to ESLint (issue [#290](https://github.com/alefragnani/vscode-bookmarks/issues/290))
- Remove `vscode` dependency (issue [#296](https://github.com/alefragnani/vscode-bookmarks/issues/296))
- Use `vscode-ext-codicons` package  (issue [#309](https://github.com/alefragnani/vscode-bookmarks/issues/309))

## [11.2.0] - 2020-05-09
### Added
- Use selected text as Label (issue [#239](https://github.com/alefragnani/vscode-bookmarks/issues/239))
- **Side Bar** welcome message (issue [#284](https://github.com/alefragnani/vscode-bookmarks/issues/284))

### Changed
- Bookmark position in **Side Bar** became more subtle (issue [#295](https://github.com/alefragnani/vscode-bookmarks/issues/295))

### Fixed
- Avoid Bookmarks from being toggled in the new Search Editor (issue [#279](https://github.com/alefragnani/vscode-bookmarks/issues/279))

## [11.1.0] - 2020-04-10
### Added
- Multi Cursor support (issue [#77](https://github.com/alefragnani/vscode-bookmarks/issues/77))

### Internal
- Support VS Code package split  (issue [#263](https://github.com/alefragnani/vscode-bookmarks/issues/263))
- Support **ThemeIcon** (issue [#269](https://github.com/alefragnani/vscode-bookmarks/issues/269))
- Support Extension View Context Menu (issue [#270](https://github.com/alefragnani/vscode-bookmarks/issues/270))

## [11.0.0] - 2020-02-17
### Added
- Support `workbench.colorCustomizations` (issue [#246](https://github.com/alefragnani/vscode-bookmarks/issues/246))

### Internal
- Use `vscode-ext-selection` and `vscode-ext-decoration` packages

## [10.7.0] - 2020-01-27
### Added
- Hover buttons for File and Bookmarks in Side Bar (issue [#258](https://github.com/alefragnani/vscode-bookmarks/issues/258))
- Relative path next to the filename in Side Bar (issue [#236](https://github.com/alefragnani/vscode-bookmarks/issues/236))

### Internal
- Renew iconography to match new VS Code identity (issue [#231](https://github.com/alefragnani/vscode-bookmarks/issues/231))
- Shrink installation size (issue [#190](https://github.com/alefragnani/vscode-bookmarks/issues/190))

## [10.6.0] - 2019-11-21
### Added
- `Collapse All` command in the Side Bar (issue [#92](https://github.com/alefragnani/vscode-bookmarks/issues/92))
- New Setting to start Side Bar expanded (issue [#176](https://github.com/alefragnani/vscode-bookmarks/issues/176))

### Changed
- The `Expand Selection ...` commands now works even if the file has only one Bookmark (issue [#120](https://github.com/alefragnani/vscode-bookmarks/issues/120))
- Update CodeStream Ad and URL

## [10.5.0] - 2019-08-12
### Added
- Localization support - Portuguese (Brazil)
- Remote Development support for configurations - (issue [#219](https://github.com/alefragnani/vscode-bookmarks/issues/219))
- New Side Bar icon matching new VS Code icon style (Thanks to @snnsnn [PR #227](https://github.com/alefragnani/vscode-bookmarks/pull/227))
- Show only filename in Side Bar (issue [#149](https://github.com/alefragnani/vscode-bookmarks/issues/149))

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