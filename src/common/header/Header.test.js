import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import { MockYoutubeService } from '../../../test/src/mock/MockYoutubeService.test';

const config = {
  maxVideosToLoad: 24
};

const services = {
  youtubeService: new MockYoutubeService()
    .listCategories([])
    .mock
};


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Header services={services} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Opens slide filters properly', () => {
  const div = document.createElement('div');
  const header = ReactDOM.render(<Header services={services} config={config} />, div);

  expect(header.state.drawerIsOpened).toBe(false);
  header.toggleDrawer(true);
  expect(header.state.drawerIsOpened).toBe(true);
  header.toggleDrawer(false);
  expect(header.state.drawerIsOpened).toBe(false);
});
