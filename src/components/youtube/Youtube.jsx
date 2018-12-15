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

  componentWillMount() {
    this.props.setTitle('YOUTUBE');
    this.props.onChanges(() => this.loadVideos());
  }

  async loadVideos() {
    Axios.all(await this.youtubeService.getTrendingVideos(this.props.config.maxVideosToLoad))
         .then((data) => {
           this.setState({
             trends: data,
             isError: false
           });
         })
         .catch((err) => {
           this.setState({isError: true});
           console.log(err);
         });
  }

  openVideo(videoId) {
    return window.open('//www.youtube.com/watch?v=' + videoId);
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
