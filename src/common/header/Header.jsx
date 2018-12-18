import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';

import './Header.scss';
import Logo from '../../../public/logo.svg';
import SlideFilters from '../slide-filters/SlideFilters';
import { withRouter } from 'react-router';

export class Header extends Component {
  state = {
    drawerIsOpened: false,
    title: '',
    showFilters: true
  };

  constructor(props) {
    super(props);
    setTimeout(() => {
      this.setState({title : this.props.setTitle()});
    }, 100);
  }

  /** Registers event listener to detect changes in the router in order to
   * hide filters on video player view.
   */
  componentDidMount() {
    this.props.history.listen((location, action) => {
      const showFilters = location.pathname.endsWith('/youtube');
      this.toggleFilters(showFilters);
    });
  }

  /** Shows or hides video filters.
   * @param {Boolean} show true to display filters, false otherwise.
   */
  toggleFilters(show) {
    this.setState({
      showFilters: show
    });
  }

  toggleDrawer(open) {
    this.setState({
      drawerIsOpened: open
    });
  }

  /** Renders the filters button only if it must be available. It
   * is hidden on video player view.
   */
  renderFiltersIfRequired() {
    if (this.state.showFilters) {
      return (
        <Button className="menu-toggle" onClick={ () => this.toggleDrawer(true) }>
          <SettingsIcon aria-label="Settings"/>
        </Button>
      );
    }
  }

  render() {
    return (
      <div id="page-header">
        <nav>
          <div className="logo-bg">
            <Logo className="logo"/>
          </div>
          <div className="opened-module-title">
            {this.state.title}
          </div>
          {
            this.renderFiltersIfRequired()
          }
        </nav>
        <Drawer
          anchor="right"
          open={this.state.drawerIsOpened}
          onClose={this.toggleDrawer.bind(this, false)}>
            <SlideFilters
              services={this.props.services}
              close={() => this.toggleDrawer(false) }
              config={this.props.config}
              onChanges={this.props.onChanges}/>
        </Drawer>
      </div>
    );
  }
}

Header.propTypes = {
  setTitle: PropTypes.func,
  config: PropTypes.object,
  onChanges: PropTypes.func,
  services : PropTypes.object,
  history: PropTypes.object
};

export default withRouter(Header);
