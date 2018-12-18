import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Header from '../common/header/Header';
import './App.scss';
import Youtube from './youtube/Youtube';
import YoutubePlayer from './youtube/player/Youtube.Player';
import { appConfig } from '../config';
import { YoutubeService } from '../services/youtube/Youtube';
import { isNullOrUndefined } from 'util';

/** Resolved application configuration.
 *
 * It reads the configuration stored in the browser's local storage if present.
 * Otherwise, it uses the default configuration.
 */
const config = function () {
  try {
    const storedConfig = localStorage.getItem('appConfig');
    return Object.assign(appConfig, (!isNullOrUndefined(storedConfig) && JSON.parse(storedConfig)) || {});
  } catch(cause) {
    return appConfig;
  }
}();

let store;

/** Global changes event.
 *
 * It is triggered by components when they need to persist state,
 * usally after modifying the current application configuration.
 */
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

/** Initializes application services in order to reuse the same
 * instances along the application.
 */
const services = {
  youtubeService: new YoutubeService()
};

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header
            services={services}
            config={config}
            onChanges={onChanges}
            setTitle={setTitle}
          />
          <Switch>
            <Route
              exact path="/"
              render={() => (<Redirect to="/youtube"/>)}
            />
            <Route
              exact path="/youtube"
              render={() =>
                <Youtube
                  services={services}
                  config={config}
                  onChanges={onChanges}
                  setTitle={setTitle}/>
              }
            />
            <Route
              exact path="/youtube/:videoId"
              render={ () =>
                <YoutubePlayer services={services} />
              }
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
