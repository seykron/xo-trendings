import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import YoutubePlayer from './Youtube.Player';
import { MockYoutubeService } from '../../../../test/src/mock/MockYoutubeService.test';

const services = {
  youtubeService: new MockYoutubeService()
    .isValidVideo(true)
    .mock
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><YoutubePlayer services={services} /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
