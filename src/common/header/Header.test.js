import React from 'react';
import ReactDOM from 'react-dom';
import { Header } from './Header';
import { MockYoutubeService } from '../../../test/src/mock/MockYoutubeService.test';

const config = {
  maxVideosToLoad: 24
};

const services = {
  youtubeService: new MockYoutubeService()
    .listCategories([])
    .mock
};

function render(div) {
  const history = {
    listen: jest.fn()
  };
  return ReactDOM.render(<Header config={config} history={history} services={services} />, div);
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Opens slide filters properly', () => {
  const div = document.createElement('div');
  const header = render(div);

  expect(header.state.drawerIsOpened).toBe(false);
  header.toggleDrawer(true);
  expect(header.state.drawerIsOpened).toBe(true);
  header.toggleDrawer(false);
  expect(header.state.drawerIsOpened).toBe(false);

  ReactDOM.unmountComponentAtNode(div);
});

it('Hides filters on video player', () => {
  const div = document.createElement('div');
  const header = render(div);
  const location = {
    pathname: "/youtube/video-id"
  };
  const history = header.props.history;

  expect(header.state.showFilters).toBe(true);
  expect(history.listen).toBeCalled();

  const routeEventListener = history.listen.mock.calls[0][0];
  routeEventListener(location);
  expect(header.state.showFilters).toBe(false);

  ReactDOM.unmountComponentAtNode(div);
});

it('Shows filters on trending list', () => {
  const div = document.createElement('div');
  const header = render(div);
  const location = {
    pathname: "/youtube"
  };
  const history = header.props.history;

  header.setState({
    showFilters: false
  });

  expect(header.state.showFilters).toBe(false);
  expect(history.listen).toBeCalled();

  const routeEventListener = history.listen.mock.calls[0][0];
  routeEventListener(location);
  expect(header.state.showFilters).toBe(true);

  ReactDOM.unmountComponentAtNode(div);
});
