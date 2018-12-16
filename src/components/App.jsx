import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Header from '../common/header/Header';
import './App.scss';
import Youtube from './youtube/Youtube';
import YoutubePlayer from './youtube/player/Youtube.Player';
import { appConfig } from '../config';
import { YoutubeService } from '../services/youtube/Youtube';
import { isNullOrUndefined } from 'util';

let config;

try {
  const storedConfig = localStorage.getItem('appConfig');
  config = Object.assign(appConfig, (!isNullOrUndefined(storedConfig) && JSON.parse(storedConfig)) || {});
} catch(cause) {
  config = appConfig;
}

let store;
const onChanges = (fn) => {
  if (fn) {
    store = fn;
  }
  localStorage.setItem('appConfig', JSON.stringify({
    maxVideosToLoad: config.maxVideosToLoad,
    currentRegion: config.currentRegion,
    currentCategoryId: config.currentCategoryId
  }));
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
  youtubeService: new YoutubeService()
};

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header services={services} config={config} onChanges={onChanges} setTitle={setTitle}/>
          <Switch>
            <Route exact path="/" render={() => (<Redirect to="/youtube"/>)}/>
            <Route exact path="/youtube" render={() => 
              <Youtube
                services={services}
                config={config} 
                onChanges={onChanges} 
                setTitle={setTitle}/>}
              />
            <Route exact path="/youtube/:videoId" component={YoutubePlayer}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
