import Axios from 'axios';
import { appConfig } from '../../config';
import { VideoClass } from '../../models/video.class';
import { CategoryClass } from '../../models/category.class';
import { VideoListPage } from '../../models/VideoListPage';
import { isNullOrUndefined } from 'util';

const youtubeClient = Axios.create({
  baseURL: appConfig.youtubeEndPoint
});

/** Max number of videos per page allowed by Youtube Data API. */
const MAX_VIDEOS_PER_PAGE = 50;
/** Determines the video properties to return from the Youtube Data API. */
const CATEGORIES_PART = 'snippet';

function createListParams(videosPerPage = appConfig.maxVideosToLoad,
                          pageToken) {
  return {
    part: appConfig.partsToLoad,
    chart: appConfig.chart,
    videoCategoryId: appConfig.currentCategoryId || appConfig.defaultCategoryId,
    regionCode: appConfig.currentRegion || appConfig.defaultRegion,
    maxResults: videosPerPage < MAX_VIDEOS_PER_PAGE ? videosPerPage : MAX_VIDEOS_PER_PAGE,
    key: appConfig.youtubeApiKey,
    pageToken: pageToken
  };
}

/** Gets a single page of most popular videos from the Youtube data API.
 *
 * @param {Number} videosPerPage Number of videos per page.
 * @param {String} [pageToken] A page token to fetch the next page, used for pagination, should
 * not be used from outside this function.
 */
async function fetchVideosPage(videosPerPage = appConfig.maxVideosToLoad, pageToken) {
  const params = createListParams(videosPerPage, pageToken);
  const result = await youtubeClient.get('/videos', {params});
  const nextPageToken = result.data.nextPageToken;

  return new VideoListPage(
    result.data.items.map(item =>
      new VideoClass(item)
    ),
    nextPageToken
  );
}

/** Gets most popular videos from the Youtube data API.
 *
 * @param {Number} videosPerPage Number of videos per page.
 * @param {VideoListPage} [previousPage] Previous page.
 * @param {String} videosPage.nextPageToken A page token to fetch the next page, used for pagination, should
 * not be used from outside this function.
 * @param {VideoClass[]} videosPage.videos List of already resolved videos. Used for pagination, should
 * not be used outside this function.
 */
async function fetchVideos(videosPerPage = appConfig.maxVideosToLoad, previousPage) {
  const nextPage = await fetchVideosPage(videosPerPage, previousPage && previousPage.nextPageToken);
  const nextVideos = ((previousPage && previousPage.videos) || []).concat(nextPage.videos);

  if (nextVideos.length < videosPerPage && !isNullOrUndefined(nextPage.nextPageToken)) {
    return await fetchVideos(
      videosPerPage,
      new VideoListPage(nextVideos, nextPage.nextPageToken)
    );
  } else {
    return new VideoListPage(
      nextVideos.slice(0, videosPerPage),
      nextPage.nextPageToken
    );
  }
}

export class YoutubeService {

  /** Determines whether a video id is a valid youtube video.
   *
   * @param {String} videoId Youtube id of the video to validate.
   * @returns true if the video id is a valid youtube video, false otherwise.
   */
  async isValidVideo(videoId) {
    const params = {
      part: 'id',
      id: videoId,
      key: appConfig.youtubeApiKey
    };
    const result = await youtubeClient.get('/videos', {params});

    return result.data.items.length === 1;
  }

  /** Retrieves the next page from a previous video listing operation.
   *
   * @param {Number} videosPerPage Amount of videos per page, used for pagination.
   * @param {String} nextPageToken Token to retrieve the next page.
   */
  async fetchNextPage(videosPerPage = appConfig.maxVideosToLoad, nextPageToken) {
    return await fetchVideosPage(videosPerPage, nextPageToken);
  }

  /** Returns a list of trending videos.
   *
   * @param {Number} videosPerPage Amount of videos per page, used for pagination.
   */
  async getTrendingVideos(videosPerPage = appConfig.maxVideosToLoad) {
    return await fetchVideos(videosPerPage);
  }

  /** Lists all videos categories for the current region.
   * @returns a promise to receive the list of {{CategoryClass}}es.
   */
  async listCategories() {
    const params = {
      part: CATEGORIES_PART,
      regionCode: appConfig.currentRegion || appConfig.defaultRegion,
      key: appConfig.youtubeApiKey
    };
    const categoriesResult = await youtubeClient.get('/videoCategories', {params});

    return categoriesResult.data.items
        .map(jsonCategory => new CategoryClass(jsonCategory));
  }
}
