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
 * Advanced style setting default values.
 * Used when setting is set to 'default'.
 */
export enum SettingDefaults {
  Empty = '0',
  Default = 'default',
  FontFamily = 'Roboto',
  FontSize = 'var(--joplin-font-size)',
  Background = 'var(--joplin-background-color3)',
  HoverBackground = 'var(--joplin-background-color-hover3)', // var(--joplin-background-hover)
  Foreground = 'var(--joplin-color-faded)',
  ActiveBackground = 'var(--joplin-background-color)',
  ActiveForeground = 'var(--joplin-color)',
  DividerColor = 'var(--joplin-divider-color)'
}

/**
 * Definitions of plugin settings.
 */
export class Settings {
  // private settings
  // none
  // general settings
  private _defaultLayout: LayoutType = LayoutType.None;
  // private _quickMove1: string = SettingDefaults.Empty;
  // advanced settings
  // none
  // internals
  private _defaultRegExp: RegExp = new RegExp(SettingDefaults.Default, "i");

  constructor() {
  }

  //#region GETTER

  get defaultLayout(): LayoutType {
    return this._defaultLayout;
  }

  // get quickMove1(): string {
  //   return this._quickMove1;
  // }

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

    // await joplin.settings.registerSetting('quickMove1', {
    //   value: this._quickMove1,
    //   type: SettingItemType.String,
    //   section: 'qm.settings',
    //   public: true,
    //   label: 'Notebook for quick move action 1',
    //   description: 'Select notebook to which the selected note(s) can be moved directly without interaction. Assign keyboard shortcut to command "quickMove1".'
    // });

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
    // this._quickMove1 = await this.getOrDefault(event, this._quickMove1, 'quickMove1');
  }
}
