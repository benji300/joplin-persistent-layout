import joplin from 'api';
import { MenuItemLocation, Path, SettingItemType } from 'api/types';
import { ChangeEvent } from 'api/JoplinSettings';
import { LayoutType, layoutDesc } from './helpers';

joplin.plugins.register({
  onStart: async function () {
    const COMMANDS = joplin.commands;
    const SETTINGS = joplin.settings;
    const WORKSPACE = joplin.workspace;

    //#region SETTINGS

    await SETTINGS.registerSection('persistent.layout.settings', {
      label: 'Persistent Layout',
      iconName: 'fas fa-columns'
    });

    // general settings
    let defaultLayout: LayoutType = LayoutType.None;
    await joplin.settings.registerSetting('defaultLayout', {
      value: '0',
      type: SettingItemType.Int,
      section: 'persistent.layout.settings',
      isEnum: true,
      public: true,
      label: 'Default editor layout',
      description: 'Default editor layout which is used for all notes that have no "layout" tags specified. If "None" is selected, the current active is kept.',
      options: {
        '0': 'None',
        '1': 'Editor',
        '2': 'Split View',
        '3': 'Viewer',
        '4': 'Rich Text'
      },
    });

    async function readSettings(event?: ChangeEvent) {
      if ((!event) || event.keys.includes('defaultLayout')) {
        defaultLayout = await SETTINGS.value('defaultLayout');
      }
    }

    SETTINGS.onChange(async (event: ChangeEvent) => {
      await readSettings(event);
    });

    //#endregion

    //#region HELPERS

    async function getAll(path: Path, query: any): Promise<any[]> {
      query.page = 1;
      let response = await joplin.data.get(path, query);
      let result = !!response.items ? response.items : [];
      while (!!response.has_more) {
        query.page += 1;
        let response = await joplin.data.get(path, query);
        result.concat(response.items)
      }
      return result;
    }

    async function addTag(noteId: string, layout: LayoutType) {
      let layoutTag = (await getAll(['tags'], { fields: ['id', 'title'], page: 1 }))
        .find(x => x.title == layoutDesc[layout].label);

      if (!layoutTag) {
        layoutTag = await joplin.data.post(['tags'], null, { title: layoutDesc[layout].label });
      }
      await joplin.data.post(['tags', layoutTag.id, 'notes'], null, { id: noteId });
    }

    async function removeTag(noteId: string, layout: LayoutType) {
      let layoutTag = (await getAll(['tags'], { fields: ['id', 'title'], page: 1 }))
        .find(x => x.title == layoutDesc[layout].label);

      if (layoutTag) {
        await joplin.data.delete(["tags", layoutTag.id, "notes", noteId]);
      }
    }

    async function persistEditorLayout(noteId: string, layout: LayoutType) {
      // first remove other tags
      if (LayoutType.Editor != layout) {
        await removeTag(noteId, LayoutType.Editor);
      }
      if (LayoutType.Split != layout) {
        await removeTag(noteId, LayoutType.Split);
      }
      if (LayoutType.Viewer != layout) {
        await removeTag(noteId, LayoutType.Viewer);
      }
      if (LayoutType.Richtext != layout) {
        await removeTag(noteId, LayoutType.Richtext);
      }
      // add layout tag
      await addTag(noteId, layout);
    }

    function visiblePanesMatchLayout(noteVisiblePanes: any[], layout: LayoutType): boolean {
      // noteVisiblePanes = ["editor","viewer"]
      return (layoutDesc[layout].panes.sort().toString() == noteVisiblePanes.sort().toString());
    }

    async function toggleVisiblePanes(layout: LayoutType) {
      console.debug(`Toggle layout: ${layout}`);
      const codeView: boolean = await joplin.settings.globalValue('editor.codeView');
      console.debug(`codeView: ${codeView}`);

      // toggle markdown/rich text editor
      if (layoutDesc[layout].codeView != codeView) {
        console.debug(`toggleEditors`);
        await joplin.commands.execute('toggleEditors');
      }

      // toggle panes for markdown editor
      if (layoutDesc[layout].codeView) {
        for (let i: number = 0; i < 3; i++) {
          const visiblePanes: any[] = await joplin.settings.globalValue('noteVisiblePanes');
          console.debug(`noteVisiblePanes: ${visiblePanes}`);
          if (visiblePanesMatchLayout(visiblePanes, layout)) {
            break;
          }
          await joplin.commands.execute('toggleVisiblePanes');
        }
      }
    }

    //#endregion

    //#region COMMANDS

    // Command: persistEditorLayout
    // Desc: Persist the current editor layout for the selected note(s)
    await COMMANDS.register({
      name: 'persistEditorLayout',
      label: 'Persist editor layout',
      iconName: 'fas fa-columns',
      enabledCondition: "someNotesSelected",
      execute: async (noteIds: string[]) => {
        // get selected note ids and return if empty
        let selectedNoteIds = noteIds;
        if (!selectedNoteIds) selectedNoteIds = await WORKSPACE.selectedNoteIds();
        if (!selectedNoteIds) return;

        const codeView: boolean = await SETTINGS.globalValue('editor.codeView');
        const noteVisiblePanes: any[] = await SETTINGS.globalValue('noteVisiblePanes');
        const editor: boolean = visiblePanesMatchLayout(noteVisiblePanes, LayoutType.Editor);
        const split: boolean = visiblePanesMatchLayout(noteVisiblePanes, LayoutType.Split);
        const viewer: boolean = visiblePanesMatchLayout(noteVisiblePanes, LayoutType.Viewer);

        // persist for all selected notes
        for (const noteId of selectedNoteIds) {
          if (codeView) {
            if (editor) {
              await persistEditorLayout(noteId, LayoutType.Editor);
            } else if (split) {
              await persistEditorLayout(noteId, LayoutType.Split);
            } else if (viewer) {
              await persistEditorLayout(noteId, LayoutType.Viewer);
            }
          } else {
            await persistEditorLayout(noteId, LayoutType.Richtext);
          }
        }
      }
    });

    // add commands to menu
    await joplin.views.menuItems.create('toolsPersist', 'persistEditorLayout', MenuItemLocation.Tools);

    // add commands to notes context menu
    await joplin.views.menuItems.create('notesContextPersist', 'persistEditorLayout', MenuItemLocation.NoteListContextMenu);

    // add commands to editor context menu
    await joplin.views.menuItems.create('editorContextPersist', 'persistEditorLayout', MenuItemLocation.EditorContextMenu);

    //#endregion

    //#region WORKSPACE

    WORKSPACE.onNoteSelectionChange(async () => {
      try {
        const selectedNote: any = await WORKSPACE.selectedNote();

        if (selectedNote) {
          const noteTags = await getAll(['notes', selectedNote.id, 'tags'], { fields: ['id', 'title'], page: 1 });
          let layout: LayoutType = defaultLayout;
          console.debug(`onNoteSelectionChange->selectedNote:${selectedNote.title}`);
          console.debug(`onNoteSelectionChange->selectedNote->tags:${JSON.stringify(noteTags)}`);

          if (noteTags.find(x => x.title === layoutDesc[LayoutType.Editor].label)) {          // editor
            layout = LayoutType.Editor;
          } else if (noteTags.find(x => x.title === layoutDesc[LayoutType.Split].label)) {    // split view
            layout = LayoutType.Split;
          } else if (noteTags.find(x => x.title === layoutDesc[LayoutType.Viewer].label)) {   // viewer
            layout = LayoutType.Viewer;
          } else if (noteTags.find(x => x.title === layoutDesc[LayoutType.Richtext].label)) { // rich text
            layout = LayoutType.Richtext;
          }

          if (layout > 0) {
            await toggleVisiblePanes(layout);
          }
        }
      } catch (error) {
        console.error(`onNoteSelectionChange: ${error}`);
      }
    });

    //#endregion

    await readSettings();
  }
});
