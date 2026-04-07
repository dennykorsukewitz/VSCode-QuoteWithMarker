# [2.1.0] - 2026-04-07

## Added

- Command **Insert marker frame only** (`quoteWithMarkerFrame`): inserts the marker header/footer without quoting the selection twice or appending a second raw copy (useful for short review notes).
- Command **Set code marker…** (`quoteWithMarker.setCodeMarker`): change `quoteWithMarker.codeMarker` from the Command Palette via a quick pick (current marker, workspace folder name, recently used values, or **New…**) and an input step; recent markers are persisted in extension global state; when the template has no `${year}` yet, the extension suggests appending a space, hyphen, space, and `${year}.${month}.${day}`.
