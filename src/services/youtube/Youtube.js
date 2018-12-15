import Axios from 'axios';
import {appConfig} from '../../config';
import {VideoClass} from '../../models/video.class';
import { isNullOrUndefined } from 'util';

const axios = Axios.create({
  baseURL: appConfig.getYoutubeEndPoint('videos')
});

const MAX_VIDEOS_PER_PAGE = 50;

function createListParams(videosPerPage = appConfig.maxVideosToLoad,
                          pageToken) {
  return {
    part: appConfig.partsToLoad,
    chart: appConfig.chart,
    videoCategoryId: appConfig.defaultCategoryId,
    regionCode: appConfig.defaultRegion,
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
  const result = await axios.get('/', {params});
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
}
