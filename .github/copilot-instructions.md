# Copilot Instructions for Bookmarks

Always reference these instructions first and fall back to additional search or terminal commands only when project files do not provide enough context.

## Project Overview

This is a Visual Studio Code extension called **Bookmarks** that helps users navigate their code by marking and jumping between important positions. The extension supports labeling bookmarks, selection commands, and provides a dedicated sidebar view.

## Technology Stack

- Language: TypeScript
- Runtime: VS Code Extension API (Node.js)
- Bundler: Webpack 5
- Linting: ESLint (`eslint-config-vscode-ext`)
- Testing: Mocha + `@vscode/test-electron`

## Working Effectively

Bootstrap and local setup:

```bash
git submodule init
git submodule update
npm install
```

Build and development quickstart:

```bash
npm run build
npm run lint
```

- Use `npm run watch` during active development.
- Use VS Code "Launch Extension" (F5) to validate behavior in Extension Development Host.
- Expected command timings are usually under 10 seconds.
- Never cancel `npm install`, `npm run watch`, or `npm test` once started.

## Build and Development Commands

- `npm run compile` - TypeScript compilation to `out/`
- `npm run build` - Webpack development build to `dist/`
- `npm run watch` - Continuous webpack build
- `npm run lint` - ESLint validation
- `npm run test` - Full test suite
- `npm run vscode:prepublish` - Production build

## Testing and Validation

Automated tests use the VS Code test runner and may fail in restricted environments due to VS Code download/network constraints.

Manual validation checklist:

1. Run `npm run build` successfully.
2. Press F5 to launch Extension Development Host.
3. Toggle bookmarks, add labeled bookmarks, and verify navigation commands.
4. Test with single and multi-root workspaces.
5. Verify bookmark persistence and sticky behavior after file edits.

## Project Structure and Key Files

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
out/                      # TypeScript output for tests
vscode-whats-new/         # Git submodule for What's New
walkthrough/              # Getting Started walkthrough content
```

## Coding Conventions and Patterns

### Indentation

- We spaces, not tabs.
- Use 4 spaces for indentation.

### Naming Conventions

- Use PascalCase for `type` names
- Use PascalCase for `enum` values
- Use camelCase for `function` and `method` names
- Use camelCase for `property` names and `local variables`
- Use whole words in names when possible

### Types

- Do not export `types` or `functions` unless you need to share it across multiple components
- Do not introduce new `types` or `values` to the global namespace
- Prefer `const` over `let` when possible.

### Strings

- Use "double quotes"
- All strings visible to the user need to be externalized using the `l10n` API
- Externalized strings must not use string concatenation. Use placeholders instead (`{0}`).

### Code Quality

- All files must include copyright header
- Prefer `async` and `await` over `Promise` and `then` calls
- All user facing messages must be localized using the applicable localization framework (for example `l10n.t` method)
- Keep imports organized: VS Code first, then internal modules.
- Use semicolons at the end of statements.
- Keep changes minimal and aligned with existing style.

### Import Organization

- Import VS Code API first: `import * as vscode from "vscode"`
- Group related imports together
- Use named imports for specific VS Code types
- Import from local modules using relative paths

### Architecture Patterns
- **Container Pattern**: The `Container` class stores global state like `Container.context`
- **Controllers**: Multiple controllers manage bookmarks for different workspaces/files
- **File Pattern**: `File` class represents a document with its bookmarks
- **Bookmark Pattern**: `Bookmark` interface with line and column positions
- **Sticky Engine**: Two implementations (legacy and new) for maintaining bookmark positions during edits
- **Decoration Pattern**: Separate decoration types for gutter icons and line backgrounds
- **Event-Driven**: Heavy use of VS Code events (`onDidChangeConfiguration`, `onDidChangeTextDocument`, etc.)

## Extension Features and Configuration

### Key Features
1. **Bookmark management**: toggle, label support
2. **Navigation**: jump to next/previous bookmarks with wrap-around support
3. **Selection**: select lines between bookmarks, expand/shrink selections
4. **Sidebar**: tree view showing all bookmarks organized by file
5. **Persistence**: Save bookmarks in workspace state or project files
6. **Sticky bookmarks**: Maintain bookmark positions during edits
7. **Multi-root workspace**: Manage bookmarks per workspace folder
8. **Remote Development**: Support for remote development scenarios
9. **Internationalization support**: Localization of all user-facing strings
10. **Customizable Appearance**: Gutter icons, line backgrounds, colors
11. **Walkthrough**: Getting Started guide for new users

### Important Settings
- `bookmarks.saveBookmarksInProject`: Save in `.vscode/bookmarks.json`
- `bookmarks.navigateThroughAllFiles`: How to navigate across files
- `bookmarks.gutterIconFillColor`: Gutter icon background color
- `bookmarks.experimental.enableNewStickyEngine`: Use new sticky engine (default: true)

## Dependencies and External Tools

- Requires `vscode-whats-new` submodule initialization.
- No external runtime tools are required beyond standard extension toolchain.

## Troubleshooting and Known Limitations

- If lint references `vscode-whats-new`, ensure submodules were initialized.
- If command/menu changes do not appear, rebuild and reload Extension Development Host.
- Test runner may fail in restricted environments due to VS Code download/network constraints.

## CI and Pre-Commit Validation

Before committing:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Launch Extension Development Host and validate key bookmark flows.

## Common Tasks

### Adding a New Command
1. Add command to `package.json` under `contributes.commands`.
2. Register command handler in `src/extension.ts`.
3. Add localization string to `package.nls.json`.
4. Update menus/keybindings if needed.

### Modifying Bookmark Behavior
- Core logic: `src/core/operations.ts`
- Sticky behavior: `src/sticky/`
- UI updates: `src/decoration/` and `src/sidebar/`

