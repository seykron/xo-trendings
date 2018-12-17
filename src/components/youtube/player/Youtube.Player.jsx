import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Youtube.Player.scss';

class YoutubePlayer extends Component {
  constructor(props) {
    super(props);
    this.youtubeService = this.props.services.youtubeService;
    const id = window.location.href
      .replace(/^.*\//g, '')
      .replace(/^.*\..*/g, '');

    this.state = {
      videoId: id
    };
  }

  componentDidMount() {
    const videoId = this.state.videoId;

    this.youtubeService.isValidVideo(this.state.videoId).then(
      isValidId => {

        if (isValidId) {
          const iframe = '<iframe title="Video"' +
            '        width="100%"' +
            '        height="100%"' +
            '        src=https://www.youtube.com/embed/'+videoId+'?autoplay=1'+
            '        frameBorder="0"'+
            '        allowFullScreen/>';
          setTimeout(() => {
            if (document.getElementsByClassName('frame-block')[0]) {
              document.getElementsByClassName('frame-block')[0].innerHTML = iframe;
            }
          }, 1000);  
        } else {
          window.location.replace('/youtube');
        }
      });
  }

  render() {
    return (
      <div className="video-container">
        <div className="frame-block"/>
        <div className="controls">
          <Link className="btn btn-primary" to="/youtube"> &#60; Back to Trends</Link>
        </div>
      </div>);
  }
}

YoutubePlayer.propTypes = {
  services : PropTypes.object
};

export default YoutubePlayer;
