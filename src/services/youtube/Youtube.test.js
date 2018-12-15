import { YoutubeService } from './Youtube';
import expect from 'expect';

it('renders without crashing', () => {
 new YoutubeService();
});

it('getTrendingVideos function with default configuration', async () => {
  const service = new YoutubeService();
  const result = await service.getTrendingVideos();
  expect(result.length).toEqual(24);
});

it('getTrendingVideos function with more than 50 videos', async () => {
  const service = new YoutubeService();
  const result = await service.getTrendingVideos(57);
  expect(result.length).toEqual(57);
});

it('getTrendingVideos function with more than maximum videos allowed by Youtube', async () => {
  const service = new YoutubeService();
  const result = await service.getTrendingVideos(250);
  expect(result.length).toEqual(200);
});
