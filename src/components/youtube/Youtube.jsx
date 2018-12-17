/* eslint-disable */
import React, { Component } from 'react';
import Axios from 'axios';
import MovieIcon from '@material-ui/icons/Movie';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FavoriteIcon from '@material-ui/icons/Favorite';
import WarningIcon from '@material-ui/icons/Warning';
import PropTypes from 'prop-types';

import './Youtube.scss';

class Youtube extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trends: [],
      isError: false
    };
    this.youtubeService = this.props.services.youtubeService;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.loadNextPageIfRequired.bind(this));
  }

  componentWillMount() {
    this.props.setTitle('YOUTUBE');
    this.props.onChanges(() => this.loadVideos());
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.loadNextPageIfRequired.bind(this));
  }

  isBottom() {
    const rootElement = document.getElementById('root');
    return rootElement.getBoundingClientRect().bottom <= window.innerHeight;
  }

  /** Loads the next videos page if the user reached the bottom of the page.
   *
   * This function does not load the remaining videos from the previous page, it
   * only loads the next page, so it is possible to miss some videos depending on
   * the maxVideosToLoad value but it's good enough to display a list of
   * recommendations.
   */
  async loadNextPageIfRequired() {
    if (this.isBottom() && this.state.nextPageToken && !this.state.loading) {
      try {
        this.setState({
          loading: true
        });
        const currentVideos = this.state.trends;
        const nextPage = await this.youtubeService.fetchNextPage(
          this.props.config.maxVideosToLoad,
          this.state.nextPageToken
        );
        this.setState({
          trends: currentVideos.concat(nextPage.videos),
          nextPageToken: nextPage.nextPageToken,
          loading: false,
          isError: false
        });
      } catch (cause) {
        this.setState({
          trends: [],
          isError: true
        });
      }
    }
  }

  async loadVideos() {
    try {
      const page = await this.youtubeService.getTrendingVideos(this.props.config.maxVideosToLoad);
      this.setState({
        trends: page.videos,
        nextPageToken: page.nextPageToken,
        isError: false
      });
    } catch (cause) {
      this.setState({isError: true});
    }
  }

  openVideo(videoId) {
    return window.location.replace('/youtube/' + videoId);
  }

  youtubeCard() {
    return this.state.trends.map((video, index) =>
      <div key={index} className="card-container">
        <div className="card" onClick={this.openVideo.bind(this, [video.id])}>
          <div className="img-container">
            <img src={video.thumbnail} alt={video.title}/>
            <MovieIcon/>
          </div>
          <div className="video-statistic">
            <div className="publishedAt">
              <AvTimerIcon/>
              <span>{video.publishedAt}</span>
            </div>
            <div className="viewCount">
              <VisibilityIcon/>
              <span>{video.viewCount}</span>
            </div>
            <div className="likeCount">
              <FavoriteIcon/>
              <span>{video.likeCount}</span>
            </div>
          </div>
          <p className="video-title text-ellipsis">
            {video.title}
          </p>
        </div>
      </div>
    );
  }

  errorOnPage() {
    return <div className="error-plate">
    <WarningIcon/>
    <span>Error loading. Please try again later.</span>
  </div>;
  }

  render() {
    return !this.state.isError ? ( <div id="youtube">
      <div className="row">
        {this.youtubeCard()}
      </div>
    </div>) : (this.errorOnPage());
  }
}

Youtube.propTypes = {
  setTitle : PropTypes.func,
  config   : PropTypes.object,
  onChanges: PropTypes.func
};

export default Youtube;
