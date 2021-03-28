import joplin from 'api';
import { Path } from 'api/types';

/**
 * Helper class for data accesses.
 */
export class DA {

  private static async getAll(path: Path, query: any): Promise<any[]> {
    query.page = 1;
    let response = await joplin.data.get(path, query);
    // console.log(`response: ${JSON.stringify(response)}`);
    let result = !!response.items ? response.items : [];
    while (!!response.has_more) {
      // console.log(`has_more`);
      query.page += 1;
      response = await joplin.data.get(path, query);
      result.concat(response.items)
    }
    // console.log(`result: ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * Gets all folders sorted by their title.
   * By default it includes the fields: id, title, parent_id
   */
  static async getFolders(extraFields?: string[]): Promise<any[]> {
    try {
      const fields: string[] = ['id', 'title', 'parent_id'];
      if (extraFields) fields.push(...extraFields);
      return await DA.getAll(['folders'], { fields: fields, order_by: 'title', order_dir: 'ASC', page: 1 });
    } catch (e) {
      return [];
    }
  }

  /**
   * Gets all folders sorted by their title and filtered by the handled predicate.
   * By default it includes the fields: id, title, parent_id
   */
  static async getFoldersFiltered(predicate: (value: any, index: number, array: any[]) => unknown, extraFields?: string[]): Promise<any[]> {
    try {
      const fields: string[] = ['id', 'title', 'parent_id'];
      if (extraFields) fields.push(...extraFields);
      const folders: any[] = await DA.getAll(['folders'], { fields: fields, order_by: 'title', order_dir: 'ASC', page: 1 })
      return folders.filter(predicate);
    } catch (e) {
      return [];
    }
  }

  /**
   * Gets all subfolders of the handled folder sorted by their title.
   * By default it includes the fields: id, title, parent_id
   */
  static async getFoldersOfFolder(folderId: string, extraFields?: string[]): Promise<any[]> {
    return await DA.getFoldersFiltered(x => x.parent_id === folderId, extraFields);
  }

  /**
   * Gets the folder with the handle ID or null.
   * By default it includes the fields: id, title
   */
  static async getFolder(id: string, extraFields?: string[]): Promise<any | null> {
    try {
      const fields: string[] = ['id', 'title', 'parent_id'];
      if (extraFields) fields.push(...extraFields);
      return await joplin.data.get(['folders', id], { fields: fields });
    } catch (e) {
      return null;
    }
  }

  /**
   * Gets all notes sorted by their title.
   * By default it includes the fields: id, title, is_todo
   */
  static async getNotes(extraFields?: string[]): Promise<any[]> {
    try {
      const fields: string[] = ['id', 'title', 'is_todo'];
      if (extraFields) fields.push(...extraFields);
      return await DA.getAll(['notes'], { fields: fields, order_by: 'title', order_dir: 'ASC', page: 1 });
    } catch (e) {
      return [];
    }
  }

  /**
   * Gets all notes sorted by their title and filtered by the handled predicate.
   * By default it includes the fields: id, title, is_todo
   */
  static async getNotesFiltered(predicate: (value: any, index: number, array: any[]) => unknown, extraFields?: string[]): Promise<any[]> {
    try {
      const fields: string[] = ['id', 'title', 'is_todo'];
      if (extraFields) fields.push(...extraFields);
      const notes: any[] = await DA.getAll(['notes'], { fields: fields, order_by: 'title', order_dir: 'ASC', page: 1 });
      return notes.filter(predicate);
    } catch (e) {
      return [];
    }
  }

  /**
   * Gets all notes of the handled folder sorted by their title.
   * By default it includes the fields: id, title, is_todo
   */
  static async getNotesOfFolder(folderId: string, extraFields?: string[]): Promise<any[]> {
    try {
      const fields: string[] = ['id', 'title', 'is_todo'];
      if (extraFields) fields.push(...extraFields);
      return await DA.getAll(['folders', folderId, 'notes'], { fields: fields, order_by: 'title', order_dir: 'ASC', page: 1 });
    } catch (e) {
      return [];
    }
  }

  /**
  * Gets all notes of the handled folder sorted by their title.
  * By default it includes the fields: id, title, is_todo
  */
  static async getNotesOfTag(tagId: string, extraFields?: string[]): Promise<any[]> {
    try {
      const fields: string[] = ['id', 'title', 'is_todo'];
      if (extraFields) fields.push(...extraFields);
      return await DA.getAll(['tags', tagId, 'notes'], { fields: fields, order_by: 'title', order_dir: 'ASC', page: 1 });
    } catch (e) {
      return [];
    }
  }

  /**
   * Gets the note with the handle ID or null.
   * By default it includes the fields: id, title, is_todo
   */
  static async getNote(id: string, extraFields?: string[]): Promise<any | null> {
    try {
      const fields: string[] = ['id', 'title', 'is_todo'];
      if (extraFields) fields.push(...extraFields);
      return await joplin.data.get(['notes', id], { fields: fields });
    } catch (e) {
      return null;
    }
  }

  /**
   * Gets All tags sortedsorted by their title.
   * By default it includes the fields: id, title
   */
  static async getTags(extraFields?: string[]): Promise<any[]> {
    try {
      const fields: string[] = ['id', 'title'];
      if (extraFields) fields.push(...extraFields);
      return await DA.getAll(['tags'], { fields: fields, order_by: 'title', order_dir: 'ASC', page: 1 });
    } catch (e) {
      return [];
    }
  }

  /**
   * Gets all tags of the handled note sorted by their title.
   * By default it includes the fields: id, title
   */
  static async getTagsOfNote(noteId: string, extraFields?: string[]): Promise<any[]> {
    try {
      const fields: string[] = ['id', 'title'];
      if (extraFields) fields.push(...extraFields);
      return await DA.getAll(['notes', noteId, 'tags'], { fields: fields, order_by: 'title', order_dir: 'ASC', page: 1 });
    } catch (e) {
      return [];
    }
  }

  /**
   * Gets the tag with the handle ID or null.
   * By default it includes the fields: id, title
   */
  static async getTag(id: string, extraFields?: string[]): Promise<any | null> {
    try {
      const fields: string[] = ['id', 'title'];
      if (extraFields) fields.push(...extraFields);
      return await joplin.data.get(['tags', id], { fields: fields });
    } catch (e) {
      return null;
    }
  }
}