import { VideoClass } from './video.class';
import expect from 'expect';
const videoData = require('../../test/resources/models/video-01');

it('parses data propertly', async () => {
  const video = new VideoClass(videoData);

  expect(video.id).toEqual("gl1aHhXnN1k");
  expect(video.title).toEqual("Ariana Grande - thank u, next");
  expect(video.thumbnail).toEqual("https://i.ytimg.com/vi/gl1aHhXnN1k/hqdefault.jpg");
  expect(video.publishedAt).toEqual("15 days ago");
  expect(video.likeCount).toEqual(7469122);
  expect(video.viewCount).toEqual(173924651);
});
