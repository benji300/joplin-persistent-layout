interface ILayoutDesc {
  valid: boolean
  codeView: boolean,
  panes: string[]
}

const LayoutDesc: ILayoutDesc[] = [
  { valid: false, codeView: true, panes: [""] }, // none
  { valid: true, codeView: true, panes: ["editor"] }, // editor
  { valid: true, codeView: true, panes: ["editor", "viewer"] }, // split view
  { valid: true, codeView: true, panes: ["viewer"] }, // viewer
  { valid: true, codeView: false, panes: [""] }, // rich text (WYSIWYG)
  { valid: true, codeView: false, panes: [""] }, // previous
];

export enum LayoutType {
  None = 0,
  Editor = 1,
  Split = 2,
  Viewer = 3,
  Richtext = 4, // WYSIWYG
  Previous = 5
}

export class Layout {
  private _type: LayoutType = LayoutType.None;

  private constructor(type: LayoutType) {
    this._type = type;
  }

  get type(): LayoutType {
    return this._type;
  }

  static create(type: LayoutType): Layout {
    return new Layout(type);
  }

  static matchesVisiblePanes(type: LayoutType, visiblePanes: any[]): boolean {
    // noteVisiblePanes = ["editor","viewer"]
    return (LayoutDesc[type].panes.sort().toString() == visiblePanes.sort().toString());
  }

  static getLayoutType(codeView: boolean, visiblePanes: any[]): LayoutType {
    if (codeView) {
      if (Layout.matchesVisiblePanes(LayoutType.Editor, visiblePanes)) {
        return LayoutType.Editor;
      } else if (Layout.matchesVisiblePanes(LayoutType.Split, visiblePanes)) {
        return LayoutType.Split;
      } else if (Layout.matchesVisiblePanes(LayoutType.Viewer, visiblePanes)) {
        return LayoutType.Viewer;
      } else {
        return LayoutType.None;
      }
    } else {
      return LayoutType.Richtext;
    }
  }

  set(layout: LayoutType) {
    this._type = layout;
  }

  isValid(): boolean {
    return LayoutDesc[this._type].valid;
  }

  isCodeView(): boolean {
    return LayoutDesc[this._type].codeView;
  }
}
