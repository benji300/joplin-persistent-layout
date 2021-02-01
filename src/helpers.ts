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
export const layoutDesc: ILayoutDesc[] = [
  { label: 'layout:none', codeView: true, panes: [""] }, // no change
  { label: 'layout:editor', codeView: true, panes: ["editor"] }, // editor
  { label: 'layout:split', codeView: true, panes: ["editor", "viewer"] }, // split view
  { label: 'layout:viewer', codeView: true, panes: ["viewer"] }, // viewer
  { label: 'layout:richtext', codeView: false, panes: [""] } // rich text (WYSIWYG)
];
