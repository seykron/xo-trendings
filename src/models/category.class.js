import { isNullOrUndefined } from 'util';

/** Represents a Youtube video category.
 * 
 * @see https://developers.google.com/youtube/v3/docs/videoCategories
 */
export class CategoryClass {
  /**  Category id, used to filter videos. */
  id = '';
  /** Category name. */
  name = '';

  constructor(jsonCategory) {
    if (isNullOrUndefined(jsonCategory) || isNullOrUndefined(jsonCategory.id)) {
      throw new Error('Invalid category result.');
    }

    this.id = jsonCategory.id;
    this.name = jsonCategory.snippet.title;
  }
}
