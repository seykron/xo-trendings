/** Represents a video listing result with paging information.
 *
 * @see https://developers.google.com/youtube/v3/docs/videos/list
 */
export class VideoListPage {

  /**  List of videos in the current page.
   * @type {VideoClass[]}
   */
  videos = [];

  /** Token to retrieve the next video page.
   * @type {String}
   */
  nextPageToken = null;

  constructor(videos, nextPageToken) {
    this.videos = videos;
    this.nextPageToken = nextPageToken;
  }
}
