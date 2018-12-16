import React from 'react';
import ReactDOM from 'react-dom';
import SlideFilters from './SlideFilters';
import { MockYoutubeService } from '../../../test/src/mock/MockYoutubeService.test';
import { appConfig } from '../../config';

const config = {maxVideosToLoad:24};
let store;
const onChanges = (fn) => {
  if (fn) {
    store = fn;
  }

  store();
};

const categories = [{
  id: 1,
  name: "Music"
}];

const services = {
  youtubeService: new MockYoutubeService()
    .listCategories(categories)
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
  ReactDOM.unmountComponentAtNode(div);
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
  ReactDOM.unmountComponentAtNode(div);
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

  ReactDOM.unmountComponentAtNode(div);
});

it('restores previous state', async () => {
  const div = document.createElement('div');
  const filtersConfig = Object.assign({
    currentCategoryId: 1,
    currentRegion: "AF"
  }, config);
  
  const youtubeService = {
    listCategories: jest.fn()
  };
  const slideFilters = ReactDOM.render(<SlideFilters 
    services={services} 
    close={close} 
    config={filtersConfig} 
    onChanges={onChanges}
  />, div);

  await slideFilters.componentDidMount();

  expect(slideFilters.state.currentCategory).toBe(categories[0]);
  expect(slideFilters.state.currentRegion).toBe(appConfig.countryList[0]);

  ReactDOM.unmountComponentAtNode(div);
});
