# Functionality

Mark lines in the editor and easily jump to them.

# Installation

Press `F1` in VSCode, then type `ext install bookmarks`.

# Usage

## Available commands

* **Bookmarks: Toggle** Mark/unmark lines with bookmarks
* **Bookmarks: Jump to Next** Move the cursor forward, to the bookmark below
* **Bookmarks: Jump to Previous** Move the cursor backward, to the bookmark above
* **Bookmarks: List** List all bookmarks from the current file
* **Bookmarks: Clear** remove all bookmarks from the current file

![Commands](images/bookmarks-commands.png)

### Bookmark: Toggle

You can easily Mark/Unmark bookmarks on any line. Works even for wrapped lines.

![Toggle](images/bookmarks-toggle.png)

> _new in version 0.4.0_  

### Bookmarks: List

List all bookmarks from the current file and easily navigate to any one. It shows you the line contents and temporarily scroll to that line.

![List](images/bookmarks-list.gif)

## Available settings

> _new in version 0.2.0_  

* Allow bookmarks to be saved and restored, even if you close or change the Project
```
    "bookmarks.saveBookmarksBetweenSessions": true
```

* Path to another image to be shown as Bookmark (16x16 px)
```
    "bookmarks.gutterIconPath": "c:\\temp\\othericon.png"
```

## Project and Session Based

The bookmarks are saved _per session_ for the project that you are using. You don't have to worry about closing files in _Working Files_. When you reopen the file, the bookmarks are restored.

It also works even if you only _preview_ a file (simple click in TreeView). You can put bookmarks in any file and when you preview it again, the bookmarks will be there.

# Known Issues

- Hiting `Enter` in lines with bookmarks, temporarily also moves the bookmarks, but when you stop typing, the bookmark is correctly presented on the original line.

# Changelog

## Version 0.4.0

* **New Command:** List all bookmarks from the current file

## Version 0.3.0

* License updated

## Version 0.2.0

* **New Setting:** Save bookmarks between sessions
* **New Setting:** Change the bookmark icon

## Version 0.1.1

* Initial release

# Participate

If you have any idea, feel free to create issues and pull requests

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani

---

[![Paypal Donations](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) if you enjoy using this extension :-)