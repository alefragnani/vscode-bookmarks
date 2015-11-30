# Functionality

Mark lines in the editor and easily jump to them.

# Usage

## Available commands

* **Bookmarks: Toggle** Mark/unmark lines with bookmarks
* **Bookmarks: Jump to Next** Move the cursor forward, to the bookmark below
* **Bookmarks: Jump to Previous** Move the cursor backward, to the bookmark above
* **Bookmarks: Clear** remove all bookmarks from the current file

![Commands](images/bookmarks-commands.png)

### Toggle Bookmark

You can easily Mark/Unmark bookmarks on any line. Works even for wrapped lines.

![Toggle](images/bookmarks-toggle.png)

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

# TODO List

Here are some ideas that will be added soon:

* ~~**Save bookmarks between sessions:** Allow the bookmarks to be saved and restored, even if you close **Code** or change the active Project/Folder.~~
* ~~**Change the bookmark icon:** Allow you to define which icon do you want to use as bookmark~~
* **Preview bookmarked lines:** Create a new command (**Bookmarks: List**) that will show all bookmarked lines, with its content, so you easily identify which bookmark you would want to go.

# Known Issues

- Hiting `Enter` in lines with bookmarks, temporarily also moves the bookmarks, but when you stop typing, the bookmark is correctly presented on the original line.

# Changelog

## Version 0.2.0

* **New:** Save bookmarks between sessions
* **New:** Change the bookmark icon

## Version 0.1.1

* Initial release


# Participate

If you have any idea, feel free to create issues and pull requests