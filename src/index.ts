import joplin from 'api';

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

    async function toggleVisiblePanes(layout: LayoutType) {
      for (let i: number = 0; i < 3; i++) {
        // ["editor","viewer"]
        let noteVisiblePanes: any[] = await SETTINGS.globalValue('noteVisiblePanes');

        if (noteVisiblePanes.sort().toString() == LayoutSpec[layout].panes.sort().toString())
          break;

        await COMMANDS.execute('toggleVisiblePanes');
      }
    }

    //#endregion

    //#region WORKSPACE

    WORKSPACE.onNoteSelectionChange(async () => {
      try {
        const selectedNote: any = await WORKSPACE.selectedNote();
        const isCodeEditor: boolean = await SETTINGS.globalValue('editor.codeView');

        if (selectedNote && isCodeEditor) {

          // retrieve tags from note
          const tags: any = await DATA.get(['notes', selectedNote.id, 'tags'], { fields: ['title'] });

          // editor
          if (tags.items.find(x => x.title === LayoutSpec[LayoutType.Editor].label)) {
            await toggleVisiblePanes(LayoutType.Editor);
            return;
          }

          // split view
          if (tags.items.find(x => x.title === LayoutSpec[LayoutType.Split].label)) {
            await toggleVisiblePanes(LayoutType.Split);
            return;
          }

          // viewer
          if (tags.items.find(x => x.title === LayoutSpec[LayoutType.Viewer].label)) {
            await toggleVisiblePanes(LayoutType.Viewer);
            return;
          }
        }
      } catch (error) {
        console.error(`onNoteSelectionChange: ${error}`);
      }
    });

    //#endregion

  }
});
