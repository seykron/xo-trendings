import { Mock } from "./Mock.test";

export class MockYoutubeService extends Mock {

  getTrendingVideos(videosPerPage = appConfig.maxVideosToLoad, returnValue) {
    return this.invoke("getTrendingVideos", returnValue, [videosPerPage]);
  }

  /** Lists all videos categories for the current region.
   * @returns a promise to receive the list of {{CategoryClass}}es.
   */
  listCategories(returnValue) {
    return this.invoke("listCategories", returnValue);
  }
}
