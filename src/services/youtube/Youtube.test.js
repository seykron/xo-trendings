import { YoutubeService } from './Youtube';
import expect from 'expect';
import { isNullOrUndefined } from 'util';

// TODO(matias.mirabelli): mock Axios in order to avoid real calls to youtube
// videos API. Tests should work offline.

it('renders without crashing', () => {
 new YoutubeService();
});

it('getTrendingVideos function with default configuration', async () => {
  const service = new YoutubeService();
  const result = await service.getTrendingVideos();
  expect(result.videos.length).toEqual(24);
});

it('getTrendingVideos function with more than 50 videos', async () => {
  const service = new YoutubeService();
  const result = await service.getTrendingVideos(57);
  expect(result.videos.length).toEqual(57);
});

it('getTrendingVideos function with more than maximum videos allowed by Youtube', async () => {
  const service = new YoutubeService();
  const result = await service.getTrendingVideos(250);
  expect(result.videos.length).toEqual(200);
});

it('listCategories should list videos categories properly', async () => {
  const service = new YoutubeService();
  const categories = await service.listCategories();
  expect(categories.length > 0).toBeTruthy();

  for (let category of categories) {
    expect(!isNullOrUndefined(category.id)).toBeTruthy();
    expect(!isNullOrUndefined(category.name)).toBeTruthy();
  }
});

it('must validate valid video id', async () => {
  const service = new YoutubeService();
  const validResult = await service.isValidVideo('3Lw-QrjBa60');
  const invalidResult = await service.isValidVideo('foo');

  expect(validResult).toBeTruthy();
  expect(invalidResult).toBeFalsy();
});
