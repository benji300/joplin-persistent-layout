import joplin from 'api';
import { MenuItemLocation, Path } from 'api/types';

joplin.plugins.register({
  onStart: async function () {
    const COMMANDS = joplin.commands;
    const DATA = joplin.data;
    const SETTINGS = joplin.settings;
    const WORKSPACE = joplin.workspace;

    //#region HELPERS

    enum LayoutType {
      Editor = 0,
      Split = 1,
      Viewer = 2
    }

    /**
     * Definition of the favorite descriptions.
     */
    interface ILayoutSpec {
      label: string,
      panes: string[]
    }

    /**
     * Array of favorite descriptions. Order must match with LayoutType enum.
     */
    const LayoutSpec: ILayoutSpec[] = [
      { label: 'layout:editor', panes: ["editor"] }, // Editor
      { label: 'layout:split', panes: ["editor", "viewer"] }, // Split
      { label: 'layout:viewer', panes: ["viewer"] } // Viewer
    ];

    async function getAll(path: Path, query: any): Promise<any[]> {
      query.page = 1;
      let response = await DATA.get(path, query);
      let result = !!response.items ? response.items : [];
      while (!!response.has_more) {
        query.page += 1;
        let response = await DATA.get(path, query);
        result.concat(response.items)
      }
      return result;
    }

    async function addTag(noteId: string, layout: LayoutType) {
      let layoutTag = (await getAll(['tags'], { fields: ['id', 'title'], page: 1 }))
        .find(x => x.title == LayoutSpec[layout].label);

      if (!layoutTag) {
        layoutTag = await DATA.post(['tags'], null, { title: LayoutSpec[layout].label });
      }
      await DATA.post(['tags', layoutTag.id, 'notes'], null, { id: noteId });
    }

    async function removeTag(noteId: string, layout: LayoutType) {
      let layoutTag = (await getAll(['tags'], { fields: ['id', 'title'], page: 1 }))
        .find(x => x.title == LayoutSpec[layout].label);

      if (layoutTag) {
        await DATA.delete(["tags", layoutTag.id, "notes", noteId]);
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
      // add layout tag
      await addTag(noteId, layout);
    }

    async function layoutMatchesVisiblePanes(layout: LayoutType): Promise<boolean> {
      // noteVisiblePanes = ["editor","viewer"]
      const noteVisiblePanes: any[] = await SETTINGS.globalValue('noteVisiblePanes');
      return (LayoutSpec[layout].panes.sort().toString() == noteVisiblePanes.sort().toString());
    }

    async function toggleVisiblePanes(layout: LayoutType) {
      for (let i: number = 0; i < 3; i++) {
        if (await layoutMatchesVisiblePanes(layout)) {
          break;
        }
        await COMMANDS.execute('toggleVisiblePanes');
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

        const editor: boolean = await layoutMatchesVisiblePanes(LayoutType.Editor);
        const split: boolean = await layoutMatchesVisiblePanes(LayoutType.Split);
        const viewer: boolean = await layoutMatchesVisiblePanes(LayoutType.Viewer);

        // persist for all selected notes
        for (const noteId of selectedNoteIds) {
          if (editor) {
            await persistEditorLayout(noteId, LayoutType.Editor);
          } else if (split) {
            await persistEditorLayout(noteId, LayoutType.Split);
          } else if (viewer) {
            await persistEditorLayout(noteId, LayoutType.Viewer);
          }
        }
      }
    });

    // add commands to menu
    await joplin.views.menuItems.create('toolsPersist', 'persistEditorLayout', MenuItemLocation.Tools);

    // add commands to notes context menu
    await joplin.views.menuItems.create('notesContextPersist', 'persistEditorLayout', MenuItemLocation.NoteListContextMenu);

    //#endregion

    //#region WORKSPACE

    WORKSPACE.onNoteSelectionChange(async () => {
      try {
        const selectedNote: any = await WORKSPACE.selectedNote();
        const isCodeEditor: boolean = await SETTINGS.globalValue('editor.codeView');

        if (selectedNote && isCodeEditor) {
          const noteTags = await getAll(['notes', selectedNote.id, 'tags'], { fields: ['id', 'title'], page: 1 });
          // const tags: any = await DATA.get(['notes', selectedNote.id, 'tags'], { fields: ['title'] });

          if (noteTags.find(x => x.title === LayoutSpec[LayoutType.Editor].label)) {        // editor
            await toggleVisiblePanes(LayoutType.Editor);
          } else if (noteTags.find(x => x.title === LayoutSpec[LayoutType.Split].label)) {  // split view
            await toggleVisiblePanes(LayoutType.Split);
          } else if (noteTags.find(x => x.title === LayoutSpec[LayoutType.Viewer].label)) { // viewer
            await toggleVisiblePanes(LayoutType.Viewer);
          }
        }
      } catch (error) {
        console.error(`onNoteSelectionChange: ${error}`);
      }
    });

    //#endregion

  }
});
