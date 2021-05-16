import joplin from 'api';
import { ChangeEvent } from 'api/JoplinSettings';
import { LayoutType, LayoutDesc, Settings } from './settings';
import { DA } from './data';

joplin.plugins.register({
  onStart: async function () {
    const SETTINGS = joplin.settings;
    const WORKSPACE = joplin.workspace;
    // settings
    const settings: Settings = new Settings();
    await settings.register();

    //#region HELPERS

    function checkMatchingTags(noteTags: any[], layoutTags: string[]): boolean {
      return (noteTags.findIndex(tag => layoutTags.includes(tag.title.toLocaleLowerCase())) >= 0);
    }

    function visiblePanesMatchLayout(noteVisiblePanes: any[], layout: LayoutType): boolean {
      // noteVisiblePanes = ["editor","viewer"]
      return (LayoutDesc[layout].panes.sort().toString() == noteVisiblePanes.sort().toString());
    }

    async function toggleVisiblePanes(layout: LayoutType) {
      // console.log(`Toggle layout: ${JSON.stringify(LayoutDesc[layout])}`);
      const codeView: boolean = await settings.editorCodeView;

      // toggle markdown/rich text editor
      if (LayoutDesc[layout].codeView != codeView) {
        await joplin.commands.execute('toggleEditors');
      }

      // toggle panes for markdown editor
      if (LayoutDesc[layout].codeView) {
        for (let i: number = 0; i < 3; i++) {
          const visiblePanes: any[] = await settings.noteVisiblePanes;
          if (visiblePanesMatchLayout(visiblePanes, layout)) {
            break;
          }
          await joplin.commands.execute('toggleVisiblePanes');
        }
      }
    }

    //#endregion

    //#region COMMANDS

    //#endregion

    //#region EVENTS

    WORKSPACE.onNoteSelectionChange(async () => {
      try {
        const selectedNote: any = await WORKSPACE.selectedNote();

        if (selectedNote) {
          const noteTags: any[] = await DA.getTagsOfNote(selectedNote.id);
          let layout: LayoutType = settings.defaultLayout;

          if (checkMatchingTags(noteTags, settings.editorTags)) {          // editor
            layout = LayoutType.Editor;
          } else if (checkMatchingTags(noteTags, settings.splitTags)) {    // split view
            layout = LayoutType.Split;
          } else if (checkMatchingTags(noteTags, settings.viewerTags)) {   // viewer
            layout = LayoutType.Viewer;
          } else if (checkMatchingTags(noteTags, settings.richtextTags)) { // rich text
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

    // let onChangeCnt = 0;
    SETTINGS.onChange(async (event: ChangeEvent) => {
      // console.debug(`onChange() hits: ${onChangeCnt++}`);
      await settings.read(event);
    });

    //#endregion
  }
});
