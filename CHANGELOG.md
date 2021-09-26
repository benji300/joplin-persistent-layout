# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- None

## [2.2.0] - 2021-09-26

### Added

- `Previous` selection to user option `Default editor layout`

### Fixed

- Mixed case tags ([#8](https://github.com/benji300/joplin-persistent-layout/issues/8) - Thanks to [@JackGruber](https://github.com/JackGruber))
- Layout is not set correctly on search ([#7](https://github.com/benji300/joplin-persistent-layout/issues/7)) ([#10](https://github.com/benji300/joplin-persistent-layout/issues/10) - Thanks to [@ken1kob](https://github.com/ken1kob))

## [2.1.0] - 2021-08-10

### Changed

- Updated plugin API to version v1.8.2 (`registerSettings`) to support app version v2.2.4 or newer

## [2.0.0] - 2021-03-29

### Added

- Ability to specify custom tags to force a specific editor layout

### Removed

- Command `persistEditorLayout`

## [1.1.3] - 2021-03-19

### Changed

- Menu location of `persistEditorLayout` command to `Note`

### Fixed

- Issue that might cause infinite loop in case a note has a lot of tags

## [1.1.2] - 2021-02-10

### Added

- Command `persistEditorLayout` to editor context menu

## [1.1.1] - 2021-02-02

### Fixed

- Default layout not considered at startup ([#6](https://github.com/benji300/joplin-persistent-layout/issues/6))

## [1.1.0] - 2021-02-01

### Added

- User option to specify default editor layout ([#3](https://github.com/benji300/joplin-persistent-layout/issues/3))
- Support to persist rich text editor layout ([#4](https://github.com/benji300/joplin-persistent-layout/issues/4))

## [1.0.0] - 2021-01-29

- Initial Release
