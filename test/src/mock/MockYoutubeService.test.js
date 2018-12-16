export class MockYoutubeService {

  mock = {}

  getTrendingVideos(videosPerPage = appConfig.maxVideosToLoad, returnValue) {
    this.mock.getTrendingVideos = () => new Promise((resolve, reject) =>
      resolve(returnValue)
    );
    return this;
  }

  /** Lists all videos categories for the current region.
   * @returns a promise to receive the list of {{CategoryClass}}es.
   */
  listCategories(returnValue) {
    this.mock.listCategories = () => new Promise((resolve, reject) =>
      resolve(returnValue)
    );
    return this;
  }
}
