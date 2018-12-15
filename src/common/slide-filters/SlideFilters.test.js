import React from 'react';
import ReactDOM from 'react-dom';
import SlideFilters from './SlideFilters';
import { MockYoutubeService } from '../../../test/src/mock/MockYoutubeService.test';

const config = {maxVideosToLoad:24};
let store;
const onChanges = (fn) => {
  if (fn) {
    store = fn;
  }

  store();
};

const services = {
  youtubeService: new MockYoutubeService()
    .listCategories([])
    .mock
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  const slideFilters = ReactDOM.render(<SlideFilters 
    services={services} 
    close={close} 
    config={config} 
    onChanges={onChanges}
  />, div);
});

it('closes properly', () => {
  const div = document.createElement('div');
  const close = jest.fn();
  const slideFilters = ReactDOM.render(<SlideFilters 
    services={services} 
    close={close} 
    config={config} 
    onChanges={onChanges}
  />, div);

  slideFilters.close();
  expect(close).toBeCalled();
});

it('loads categories from YoutubeService', () => {
  const div = document.createElement('div');
  const youtubeService = {
    listCategories: jest.fn()
  };
  const slideFilters = ReactDOM.render(<SlideFilters 
    services={services} 
    close={close} 
    config={config} 
    onChanges={onChanges}
  />, div);

  services.youtubeService.verify();
});
