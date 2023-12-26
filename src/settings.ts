import joplin from 'api';
import { SettingItemType } from 'api/types';
import { ChangeEvent } from 'api/JoplinSettings';
import { LayoutType } from './Layout';

/**
 * Advanced style setting default values.
 * Used when setting is set to 'default'.
 */
export enum SettingDefaults {
  Empty = '0',
  Default = 'default',
  Editor = 'layout:editor',
  Split = 'layout:split',
  Viewer = 'layout:viewer',
  Richtext = 'layout:richtext'
}

/**
 * Definitions of plugin settings.
 */
export class Settings {
  // private settings
  // none
  // general settings
  private _defaultLayout: LayoutType = LayoutType.None;
  private _editorTags: string = SettingDefaults.Editor;
  private _splitTags: string = SettingDefaults.Split;
  private _viewerTags: string = SettingDefaults.Viewer;
  private _richtextTags: string = SettingDefaults.Richtext;
  // advanced settings
  // none
  // internals
  private _defaultRegExp: RegExp = new RegExp(SettingDefaults.Default, 'i');
  private _whiteSpaceRegExp: RegExp = new RegExp(/\s/, 'gi');

  constructor() {
  }

  private asArray(tags: string): string[] {
    return tags.trim().replace(this._whiteSpaceRegExp, '').toLocaleLowerCase().split(',');
  }

  //#region GETTER

  get defaultLayout(): LayoutType {
    return this._defaultLayout;
  }

  get allLayoutTags(): string[] {
    let arr: string[] = [...this.editorTags, ...this.splitTags, ...this.viewerTags, ...this.richtextTags];
    return arr;
  }

  get editorTags(): string[] {
    return this.asArray(this._editorTags);
  }

  get splitTags(): string[] {
    return this.asArray(this._splitTags);
  }

  get viewerTags(): string[] {
    return this.asArray(this._viewerTags);
  }

  get richtextTags(): string[] {
    return this.asArray(this._richtextTags);
  }

  //#endregion

  //#region GLOBAL VALUES

  get editorCodeView(): Promise<boolean> {
    return joplin.settings.globalValue('editor.codeView');
  }

  get noteVisiblePanes(): Promise<any[]> {
    return joplin.settings.globalValue('noteVisiblePanes');
  }

  //#endregion

  /**
   * Register settings section with all options and intially read them at the end.
   */
  async register() {

    // register settings in own section
    await joplin.settings.registerSection('persistent.layout.settings', {
      label: 'Persistent Layout',
      iconName: 'fas fa-columns'
    });
    await joplin.settings.registerSettings({
      // private settings
      // none
      // general settings
      defaultLayout: {
        value: LayoutType.None,
        type: SettingItemType.Int,
        section: 'persistent.layout.settings',
        isEnum: true,
        public: true,
        label: 'Default editor layout',
        description: 'Default editor layout which is used for all notes that have no layout tags specified. ' +
          'If "None" (empty) is selected, the current active layout is kept. ' +
          'If "Previous" is selected, the last layout which was active on the last selcted note without layout tags is restored.',
        options: {
          '0': ' ',
          '1': 'Editor',
          '2': 'Split View',
          '3': 'Viewer',
          '4': 'Rich Text',
          '5': 'Previous'
        },
        storage: 2
      },
      editorTags: {
        value: this._editorTags,
        type: SettingItemType.String,
        section: 'persistent.layout.settings',
        public: true,
        label: 'Tags for editor layout mode: Markdown editor',
        description: 'Specify as comma-separated list.',
        storage: 2
      },
      splitTags: {
        value: this._splitTags,
        type: SettingItemType.String,
        section: 'persistent.layout.settings',
        public: true,
        label: 'Tags for editor layout mode: Split view',
        description: 'Specify as comma-separated list.',
        storage: 2
      },
      viewerTags: {
        value: this._viewerTags,
        type: SettingItemType.String,
        section: 'persistent.layout.settings',
        public: true,
        label: 'Tags for editor layout mode: Rendered Markdown viewer',
        description: 'Specify as comma-separated list.',
        storage: 2
      },
      richtextTags: {
        value: this._richtextTags,
        type: SettingItemType.String,
        section: 'persistent.layout.settings',
        public: true,
        label: 'Tags for editor layout mode: Rich text (WYSIWYG)',
        description: 'Specify as comma-separated list.',
        storage: 2
      },
      // advanced settings
      // none
    });

    // initially read settings
    await this.read();
  }

  private async getOrDefault(event: ChangeEvent, localVar: any, setting: string, defaultValue?: string): Promise<any> {
    const read: boolean = (!event || event.keys.includes(setting));
    if (read) {
      const value: string = await joplin.settings.value(setting);
      if (defaultValue && value.match(this._defaultRegExp)) {
        return defaultValue;
      } else {
        return value;
      }
    }
    return localVar;
  }

  /**
   * Update settings. Either all or only changed ones.
   */
  async read(event?: ChangeEvent) {
    this._defaultLayout = await this.getOrDefault(event, this._defaultLayout, 'defaultLayout');
    this._editorTags = await this.getOrDefault(event, this._editorTags, 'editorTags');
    this._splitTags = await this.getOrDefault(event, this._splitTags, 'splitTags');
    this._viewerTags = await this.getOrDefault(event, this._viewerTags, 'viewerTags');
    this._richtextTags = await this.getOrDefault(event, this._richtextTags, 'richtextTags');
  }
}
