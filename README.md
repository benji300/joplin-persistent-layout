# Joplin Persistent Editor Layout

Persistent Editor Layout is a plugin to extend the UX of [Joplin's](https://joplinapp.org/) desktop application.

It allows to persist the editor layout (editor/viewer/split view) for each note separately with [special tags](#usage).

> :warning: **CAUTION** - Requires Joplin **v1.6.7** or newer

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Persist layout for a note](#persist-layout-for-a-note)
- [User options](#user-options)
- [Feedback](#feedback)
- [Support](#support)
- [Development](#development)
- [Changes](#changes)
- [License](#license)

## Features

- Persist the editor layout (`editor / split view / viewer`) for each note
- Uses [special tags](#persist-layout-for-a-note)
  - So persisted layout is synced acrros devices
  - Requires the plugin to be installed

## Installation

### Automatic (Joplin v1.6.4 and newer)

- Open Joplin and navigate to `Tools > Options > Plugins`
- Search for `persistent editor layout` and press install
- Restart Joplin to enable the plugin

### Manual

- Download the latest released JPL package (`*.jpl`) from [here](https://github.com/benji300/joplin-persistent-layout/releases)
- Open Joplin and navigate to `Tools > Options > Plugins`
- Press `Install plugin` and select the previously downloaded `jpl` file
- Confirm selection
- Restart Joplin to enable the plugin

### Uninstall

- Open Joplin and navigate to `Tools > Options > Plugins`
- Search for the `Persistent Editor Layout` plugin
- Press `Delete` to remove the plugin completely
  - Alternatively you can also disable the plugin by clicking on the toggle button
- Restart Joplin

## Usage

### Persist layout for a note

To persist the layout for a note simply add one of the following tags as specified:

| Tag             | Layout                 |
| --------------- | ---------------------- |
| `layout:editor` | Markdown editor view   |
| `layout:split`  | Split view             |
| `layout:viewer` | Rendered markdown view |

#### Notes

- When the selected note is changed, the editor layout is changed also
- If none of the tags is specified, the editor layout is not changed
  - The currently set one will be kept, as before
- If more than one is specified, they are checked in the order above and the first matching one is used.

## Feedback

- :question: Need help?
  - Ask a question on the [Joplin Forum](https://discourse.joplinapp.org/)
- :bulb: An idea to improve or enhance the plugin?
  - Start a new discussion on the [Forum](https://discourse.joplinapp.org/) or upvote [popular feature requests](https://github.com/benji300/joplin-persistent-layout/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement+sort%3Areactions-%2B1-desc+)
- :bug: Found a bug?
  - Check the [Forum](https://discourse.joplinapp.org/) if anyone else already reported the same issue. Otherwise report it by yourself.

## Support

You like this plugin as much as I do and it improves your daily work with Joplin?

Then I would be very happy if you buy me a beer via [PayPal](https://www.paypal.com/donate?hosted_button_id=6FHDGK3PTNU22) :wink::beer:

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
