# Copilot Instructions for vscode-bookmarks

## Project Overview

This is a Visual Studio Code extension called **Bookmarks** that helps users navigate their code by marking and jumping between important positions. The extension supports labeling bookmarks, selection commands, and provides a dedicated sidebar view.

## Technology Stack

- **Language**: TypeScript
- **Build Tool**: Webpack 5
- **Target Environment**: VS Code Extension (Node.js runtime)
- **TypeScript Config**: Target ES2020, CommonJS modules
- **Linting**: ESLint with `eslint-config-vscode-ext`
- **Testing**: Mocha (test infrastructure exists in devDependencies)

## Project Structure

```
src/
├── extension.ts          # Main extension entry point
├── commands/             # Command implementations
├── core/                 # Core bookmark logic
├── decoration/           # Gutter and editor decorations
├── gutter/               # Gutter icon management
├── quickpick/            # Quick pick UI components
├── sidebar/              # Sidebar tree view provider
├── sticky/               # Sticky bookmark engine
├── storage/              # Workspace state persistence
├── utils/                # Utility functions
└── whats-new/            # What's New feature

dist/                     # Webpack output (extension-node.js)
l10n/                     # Localization files
walkthrough/              # Getting Started walkthrough content
```

## Build & Development Commands

```bash
npm run build             # Build for development
npm run watch             # Watch mode for development
npm run webpack           # Development webpack build
npm run webpack-dev       # Webpack watch mode
npm run lint              # Run ESLint
npm run vscode:prepublish # Production build (runs before publishing)
```

## Coding Standards & Conventions

### File Headers
All source files should include the GPL-3.0 license header:
```typescript
/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/
```

### Import Organization
- Import VS Code API first: `import * as vscode from "vscode"`
- Group related imports together
- Use named imports for specific VS Code types
- Import from local modules using relative paths

### Indentation & Formatting
- We use spaces, not tabs   
- Use **4 spaces** for indentation
- We use **semicolons** at the end of statements

### Code Style
- Use double quotes for strings
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Prefer `const` over `let` where possible
- Enable strict mode with `"alwaysStrict": true` in TypeScript

### Extension Architecture Patterns
- **Container Pattern**: The `Container` class stores global state like `Container.context`
- **Controllers**: Multiple controllers manage bookmarks for different workspaces/files
- **Decorations**: Bookmark decorations are managed centrally and updated when configuration changes
- **Event-Driven**: Heavy use of VS Code events (`onDidChangeConfiguration`, `onDidChangeTextDocument`, etc.)

## Key Extension Features

1. **Bookmark Management**: Toggle, add labeled, delete bookmarks
2. **Navigation**: Jump to next/previous bookmarks, with wrap-around support
3. **Selection**: Select lines between bookmarks, expand/shrink selections
4. **Sidebar**: Tree view showing all bookmarks organized by file
5. **Persistence**: Save bookmarks in workspace state or project files
6. **Sticky Bookmarks**: Bookmarks follow code when lines are added/removed
7. **Multi-root Support**: Works with multi-root workspaces
8. **Internationalization**: Support for multiple languages (l10n)

## Configuration & Settings

Important settings (see `package.json` contributes.configuration):
- `bookmarks.saveBookmarksInProject`: Save bookmarks in project vs workspace state
- `bookmarks.gutterIconFillColor`: Customize gutter icon color
- `bookmarks.navigateThroughAllFiles`: Navigate across all files
- `bookmarks.experimental.enableNewStickyEngine`: Use new sticky bookmark engine
- `bookmarks.sideBar.expanded`: Default sidebar expansion state

## Dependencies

Key dependencies:
- `vscode-ext-*`: Shared VS Code extension utilities
- `path-browserify`, `os-browserify`: Browser polyfills for path/os modules

## Development Guidelines

1. **Before Making Changes**:
   - Run `npm run lint` to check for existing issues
   - Build with `npm run build` to ensure compilation works
   - Test the extension by pressing F5 in VS Code to launch Extension Development Host

2. **When Adding Features**:
   - Register commands in `package.json` under `contributes.commands`
   - Add command handlers in `src/extension.ts` or dedicated files in `src/commands/`
   - Update decorations if visual changes are needed
   - Consider multi-root workspace scenarios
   - Add localization strings to `package.nls.json`

3. **When Modifying Configuration**:
   - Update `package.json` contributes.configuration
   - Handle configuration changes in the `onDidChangeConfiguration` listener
   - Add localization keys for new settings

4. **Testing Considerations**:
   - Manual testing in Extension Development Host is primary method
   - Test with single and multi-root workspaces
   - Test bookmark persistence across VS Code restarts
   - Verify sticky bookmarks work with code edits

## Common Tasks

### Adding a New Command
1. Add command to `package.json` contributes.commands
2. Register command handler in `src/extension.ts` using `vscode.commands.registerCommand`
3. Add localization string to `package.nls.json`
4. Update menus if command should appear in context menus or editor title

### Modifying Bookmark Behavior
- Core bookmark logic is in `src/core/`
- Operations like next/previous are in `src/core/operations.ts`
- Sticky behavior is in `src/sticky/`

### Updating UI
- Sidebar tree view: `src/sidebar/bookmarkProvider.ts`
- Decorations: `src/decoration/decoration.ts`
- Quick pick: `src/quickpick/`

## Important Notes

- Extension activates on `onStartupFinished` event
- Main entry point is `dist/extension-node.js` (built from `src/extension.ts`)
- GPL-3.0 licensed - maintain license headers
- Supports virtual workspaces and untrusted workspaces
- Published to both VS Code Marketplace and Open VSX
