export class MockYoutubeService {

  mock = {}

  isValidVideo(returnValue) {
    this.mock.isValidVideo = () => new Promise((resolve, reject) =>
      resolve(returnValue)
    );
    return this;
  }

  fetchNextPage(returnValue) {
    this.mock.fetchNextPage = () => new Promise((resolve, reject) =>
      resolve(returnValue)
    );
    return this;
  }

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
