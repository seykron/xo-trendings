import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';

const config = {
  maxVideosToLoad: 24
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Header />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Opens slide filters properly', () => {
  const div = document.createElement('div');
  const header = ReactDOM.render(<Header config={config} />, div);

  expect(header.state.drawerIsOpened).toBe(false);
  header.toggleDrawer(true);
  expect(header.state.drawerIsOpened).toBe(true);
  header.toggleDrawer(false);
  expect(header.state.drawerIsOpened).toBe(false);

  ReactDOM.unmountComponentAtNode(div);
});
