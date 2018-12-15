import Axios from 'axios';
import {appConfig} from '../../config';
import {VideoClass} from '../../models/video.class';
import {CategoryClass} from '../../models/category.class';
import { isNullOrUndefined } from 'util';

const youtubeClient = Axios.create({
  baseURL: appConfig.youtubeEndPoint
});

const MAX_VIDEOS_PER_PAGE = 50;
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

/** Gets most popular videos from the Youtube data API.
 * 
 * @param {Number} videosPerPage Number of videos per page.
 * @param {String} [pageToken] A page token to fetch the next page, used for pagination, should 
 * not be used from outside this function.
 * @param {VideoClass[]} [videos] List of already resolved videos. Used for pagination, should
 * not be used outside this function.
 */
async function fetchVideosPage(videosPerPage = appConfig.maxVideosToLoad, pageToken, videos = []) {
  const params = createListParams(videosPerPage, pageToken);
  const result = await youtubeClient.get('/videos', {params});
  const nextPageToken = result.data.nextPageToken;
  const nextVideos = videos.concat(
    result.data.items
      .map(item => new VideoClass(item))
      .filter(item => item.id !== '')
  );

  if (nextVideos.length < videosPerPage && !isNullOrUndefined(nextPageToken)) {
    return await fetchVideosPage(
      videosPerPage,
      nextPageToken,
      nextVideos
    );
  } else {
    return nextVideos.slice(0, videosPerPage);
  }
}

export class YoutubeService {
  async getTrendingVideos(videosPerPage = appConfig.maxVideosToLoad) {
    return await fetchVideosPage(videosPerPage);
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
