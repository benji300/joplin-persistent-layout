import joplin from 'api';
import { SettingItemType } from 'api/types';
import { ChangeEvent } from 'api/JoplinSettings';

/**
 * Layout type definitions.
 */
export enum LayoutType {
  None = 0,
  Editor = 1,
  Split = 2,
  Viewer = 3,
  Richtext = 4 // WYSIWYG
}

/**
 * Definition of the layout description.
 */
export interface ILayoutDesc {
  label: string,
  codeView: boolean,
  panes: string[]
}

/**
 * Array of layout descriptions. Order must match with LayoutType enum.
 */
export const LayoutDesc: ILayoutDesc[] = [
  { label: 'layout:none', codeView: true, panes: [""] }, // no change
  { label: 'layout:editor', codeView: true, panes: ["editor"] }, // editor
  { label: 'layout:split', codeView: true, panes: ["editor", "viewer"] }, // split view
  { label: 'layout:viewer', codeView: true, panes: ["viewer"] }, // viewer
  { label: 'layout:richtext', codeView: false, panes: [""] } // rich text (WYSIWYG)
];

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

  //#region GETTER

  get defaultLayout(): LayoutType {
    return this._defaultLayout;
  }

  private asArray(tags: string): string[] {
    return tags.trim().replace(this._whiteSpaceRegExp, '').toLocaleLowerCase().split(',');
    // const arr: string[] = [];
    // for (const tag of tags.trim().split(',')) {
    //   arr.push(tag.trim().toLocaleLowerCase());
    // }
    // return arr;
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

    // settings section
    await joplin.settings.registerSection('persistent.layout.settings', {
      label: 'Persistent Layout',
      iconName: 'fas fa-columns'
    });

    // private settings
    // none

    // general settings
    await joplin.settings.registerSetting('defaultLayout', {
      value: LayoutType.None,
      type: SettingItemType.Int,
      section: 'persistent.layout.settings',
      isEnum: true,
      public: true,
      label: 'Default editor layout',
      description: 'Default editor layout which is used for all notes that have no "layout" tags specified. If "None" is selected, the current active is kept.',
      options: {
        '0': ' ',
        '1': 'Editor',
        '2': 'Split View',
        '3': 'Viewer',
        '4': 'Rich Text'
      },
    });
    await joplin.settings.registerSetting('editorTags', {
      value: this._editorTags,
      type: SettingItemType.String,
      section: 'persistent.layout.settings',
      public: true,
      label: 'Tags for editor layout mode: Markdown editor',
      description: 'Specify as comma-separated list.'
    });
    await joplin.settings.registerSetting('splitTags', {
      value: this._splitTags,
      type: SettingItemType.String,
      section: 'persistent.layout.settings',
      public: true,
      label: 'Tags for editor layout mode: Split view',
      description: 'Specify as comma-separated list.'
    });
    await joplin.settings.registerSetting('viewerTags', {
      value: this._viewerTags,
      type: SettingItemType.String,
      section: 'persistent.layout.settings',
      public: true,
      label: 'Tags for editor layout mode: Rendered Markdown',
      description: 'Specify as comma-separated list.'
    });
    await joplin.settings.registerSetting('richtextTags', {
      value: this._richtextTags,
      type: SettingItemType.String,
      section: 'persistent.layout.settings',
      public: true,
      label: 'Tags for editor layout mode: Rich text (WYSIWYG)',
      description: 'Specify as comma-separated list.'
    });

    // advanced settings
    // none

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
