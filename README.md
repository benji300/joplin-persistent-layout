# Joplin Persistent Editor Layout

Persistent Editor Layout is a plugin to extend the UX of [Joplin's](https://joplinapp.org/) desktop application.

It allows to persist the editor layout for each note separately with [special tags](#usage).

> :warning: **CAUTION** - Requires Joplin **v1.7.4** or newer

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
  - [Keyboard shortcuts](#keyboard-shortcuts)
- [User options](#user-options)
- [Feedback](#feedback)
- [Support](#support)
- [Development](#development)
- [Changes](#changes)
- [License](#license)

## Features

- Persist the editor layout (`editor / split view / viewer / rich text`) for each note separately
- Using [special tags](#persist-layout-for-a-note)
  - So persisted layout is synced across (desktop) devices, if the plugin is installed

## Installation

### Automatic (Joplin v1.6.4 and newer)

- Open Joplin and navigate to `Tools > Options > Plugins`
- Search for the plugin name and press install
- Restart Joplin to enable the plugin

### Manual

- Download the latest released JPL package (`*.jpl`) from [here](https://github.com/benji300/joplin-persistent-layout/releases)
- Open Joplin and navigate to `Tools > Options > Plugins`
- Press `Install plugin` and select the previously downloaded `jpl` file
- Confirm selection
- Restart Joplin to enable the plugin

### Uninstall

- Open Joplin and navigate to `Tools > Options > Plugins`
- Search for the plugin name and press `Delete` to remove the plugin completely
  - Alternatively you can also disable the plugin by clicking on the toggle button
- Restart Joplin

## Usage

To persist the layout for a note simply add one of the following tags as specified:

| Tag               | Layout                     |
| ----------------- | -------------------------- |
| `layout:editor`   | Markdown: editor view      |
| `layout:split`    | Markdown: Split view       |
| `layout:viewer`   | Markdown: Rendered view    |
| `layout:richtext` | Rich text (WYSIWYG) editor |

This can be done by manually adding them to the notes or via the [command](#commands).

- **The setting `View > Layout button sequence` must be set according to the tags used.**
  - That means, if the tag `layout:viewer` is set in at least one note, the setting must also contain `Viewer`.
  - Otherwise the editor layout will not be changed to the expected one.
- When the selected note is changed, the editor layout is also changed.
- If none of the tags is specified, the default layout from the option `Default editor layout` will be used.
  - If `None` is selected, the currently active editor layout will be kept.
- If more than one tag is specified for a note, the first matching one is used. Depending on the above specified order.

## Commands

This plugin provides additional commands as described in the following table.

| Command Label         | Command ID            | Description                                                       | Menu contexts                                                  |
| --------------------- | --------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| Persist editor layout | `persistEditorLayout` | Persist the current active editor layout for the selected note(s) | `Note`, `NoteListContext`, `EditorContext`, `Command palette` |

### Keyboard shortcuts

Keyboard shortcuts can be assigned in user options via `Tools > Options > Keyboard Shortcuts` to all [commands](#commands) which are assigned to the `Note` menu context.
In the keyboard shortcut editor, search for the command label where shortcuts shall be added.

## User options

This plugin adds provides user options which can be changed via `Tools > Options > Persistent Layout` (Windows App).

## Feedback

- :question: Need help?
  - Ask a question on the [Joplin Forum](https://discourse.joplinapp.org/t/persist-editor-layout-plugin/14411)
- :bulb: An idea to improve or enhance the plugin?
  - Start a new discussion on the [Forum](https://discourse.joplinapp.org/t/persist-editor-layout-plugin/14411) or upvote [popular feature requests](https://github.com/benji300/joplin-persistent-layout/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement+sort%3Areactions-%2B1-desc+)
- :bug: Found a bug?
  - Check the [Forum](https://discourse.joplinapp.org/t/persist-editor-layout-plugin/14411) if anyone else already reported the same issue. Otherwise report it by yourself.

## Support

You like this plugin as much as I do and it improves your daily work with Joplin?

Then I would be very happy if you buy me a :beer: or :coffee: via [PayPal](https://www.paypal.com/donate?hosted_button_id=6FHDGK3PTNU22) :wink:

## Development

The npm package of the plugin can be found [here](https://www.npmjs.com/package/joplin-plugin-persistent-editor-layout).

### Building the plugin

If you want to build the plugin by your own simply run `npm run dist`.

### Updating the plugin framework

To update the plugin framework, run `npm run update`.

## Changes

See [CHANGELOG](./CHANGELOG.md) for details.

## License

Copyright (c) 2021 Benjamin Seifert

MIT License. See [LICENSE](./LICENSE) for more information.
