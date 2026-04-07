# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-04-07

### Added

- Command **Insert marker frame only** (`quoteWithMarkerFrame`): inserts the marker header/footer without quoting the selection twice or appending a second raw copy (useful for short review notes).
- Command **Set code marker…** (`quoteWithMarker.setCodeMarker`): change `quoteWithMarker.codeMarker` from the Command Palette via a quick pick (current marker, workspace folder name, recently used values, or **New…**) and an input step; recent markers are persisted in extension global state; when the template has no `${year}` yet, the extension suggests appending a space, hyphen, space, and `${year}.${month}.${day}`.

## [2.0.2] - 2024-04-25

### Changed

- Updated icon.

## [2.0.1] - 2024-04-24

### Changed

- Changed to reusable.release.vscode.yml.
- Keep a changelog.
- Updated icon.

## [2.0.0] - 2024-02-05

### Changed

- Changed source language to TypeScript.
- Added esbuild to get Browser Editor support.
- Refactored code.
- Added UnitTests workflow.

## [1.1.1] - 2023-09-14

### Changed

- Improved Visual Studio Code Marketplace keywords.

## [1.1.0] - 2023-08-29

### Added

- Added leading zeros to month and day to always get the same date format.
- Some languages do not have line comments, such as CSS. But, they have the possibility to comment out a code block (blockComment). Now the QuoteWithMarker can be used in these languages as well.

## [1.0.3] - 2023-08-14

### Changed

- Updated README.md.
- Tidied code.

## [1.0.2] - 2023-08-08

### Added

- Placeholder - The following placeholders have been added for the `quoteWithMarker.codeMarker` setting:

## [1.0.1] - 2023-08-08

### Changed

- Updated README.md.
- Updated categories and keywords for Visual Studio Marketplace.

## [1.0.0] - 2023-07-27

### Added

- `QuoteWithMarker` is an extension that quotes the selected area and adds a custom marker to it.
