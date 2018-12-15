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
  youtubeService: new MockYoutubeService()
    .listCategories([])
    .mock
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Youtube services={services} config={config} onChanges={onChanges} setTitle={setTitle} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('opens video in new window', () => {
  const div = document.createElement('div');

  global.open = jest.fn();
  const youtube = ReactDOM.render(<Youtube services={services} config={config} onChanges={onChanges} setTitle={setTitle} />, div);
  youtube.openVideo("video-id");
  expect(global.open).toBeCalledWith("//www.youtube.com/watch?v=video-id");
  ReactDOM.unmountComponentAtNode(div);
});
