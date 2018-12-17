import React from 'react';
import ReactDOM from 'react-dom';
import Youtube from './Youtube';
import { MockYoutubeService } from '../../../test/src/mock/MockYoutubeService.test';

const config = {};
let store;
const onChanges = (fn) => {
  if (fn) {
    store = fn;
  }

  store();
};
let titleStore = '';
const setTitle = (title) => {
  if (title) {
    titleStore = title;
  }
  return titleStore;
};
const services = {
  youtubeService: new MockYoutubeService().mock
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Youtube services={services} config={config} onChanges={onChanges} setTitle={setTitle} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('opens video in new window', () => {
  const div = document.createElement('div');

  global.location.replace = jest.fn();
  const youtube = ReactDOM.render(<Youtube services={services} config={config} onChanges={onChanges} setTitle={setTitle} />, div);
  youtube.openVideo("video-id");
  expect(global.location.replace).toBeCalledWith("/youtube/video-id");
  ReactDOM.unmountComponentAtNode(div);
});

it('scrolls and loads next page', async () => {
  const div = document.createElement('div');
  const video = {};
  const nextPage = {
    videos: [video],
    nextPageToken: "bar"
  };
  const services = {
    youtubeService: new MockYoutubeService()
    .fetchNextPage(nextPage)
    .mock
  };
  const youtube = ReactDOM.render(<Youtube services={services} config={config} onChanges={onChanges} setTitle={setTitle} />, div);
  youtube.isBottom = () => true;
  youtube.setState({nextPageToken: "foo"});

  await youtube.loadNextPageIfRequired();

  expect(youtube.state.nextPageToken).toBe('bar');
  expect(youtube.state.trends[0]).toBe(video);
  ReactDOM.unmountComponentAtNode(div);
});
