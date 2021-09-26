import joplin from 'api';
import { ChangeEvent } from 'api/JoplinSettings';
import { Settings } from './settings';
import { DA } from './data';
import { Layout, LayoutType } from './Layout';

let previousSelectedNoteId: string = '';
let previousLayoutType: LayoutType = LayoutType.Editor;
let lastNoteId: string = '';

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

    async function toggleVisiblePanes(layout: Layout) {
      // console.debug(`Toggle layout: ${JSON.stringify(layout)}`);
      const codeView: boolean = await settings.editorCodeView;

      // toggle markdown/rich text editor
      if (layout.isCodeView() != codeView) {
        // console.debug(`toggleEditors`);
        await joplin.commands.execute('toggleEditors');
      }

      // toggle panes for markdown editor
      if (layout.isCodeView()) {
        for (let i: number = 0; i < 3; i++) {
          const visiblePanes: any[] = await settings.noteVisiblePanes;
          if (Layout.matchesVisiblePanes(layout.type, visiblePanes)) {
            break;
          }
          // console.debug(`toggleVisiblePanes`);
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
          console.debug(`selected note: ${selectedNote.title}`);

          // to prevent redundant callback activations
          if (selectedNote.id === previousSelectedNoteId) return;
          previousSelectedNoteId = selectedNote.id;
          const noteTags: any[] = await DA.getTagsOfNote(selectedNote.id);
          let layout: Layout = Layout.create(settings.defaultLayout);

          if (checkMatchingTags(noteTags, settings.editorTags)) {          // editor
            layout.set(LayoutType.Editor);
          } else if (checkMatchingTags(noteTags, settings.splitTags)) {    // split view
            layout.set(LayoutType.Split);
          } else if (checkMatchingTags(noteTags, settings.viewerTags)) {   // viewer
            layout.set(LayoutType.Viewer);
          } else if (checkMatchingTags(noteTags, settings.richtextTags)) { // rich text
            layout.set(LayoutType.Richtext);
          } else { // no layout tags

            // set to previously stored layout if enabled by settings
            if (layout.type == LayoutType.Previous) {
              if (previousLayoutType != LayoutType.None) {
                layout.set(previousLayoutType);
                // console.debug(`set layout type to previous: ${previousLayoutType}`);
              }
            }
          }

          // store layout from previous note w/o layout tags
          if (lastNoteId) {
            const lastNoteTags: any[] = await DA.getTagsOfNote(lastNoteId);
            if (!checkMatchingTags(lastNoteTags, settings.allLayoutTags)) {
              const codeView: boolean = await settings.editorCodeView;
              const visiblePanes: any[] = await settings.noteVisiblePanes;
              previousLayoutType = Layout.getLayoutType(codeView, visiblePanes);
              // console.debug(`store layout type: ${previousLayoutType}`);
            }
          }

          // toggle panes
          if (layout.isValid()) {
            await toggleVisiblePanes(layout);
          }

          // store selected note id as last
          lastNoteId = selectedNote.id;
        } else {
          previousSelectedNoteId = '';
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
