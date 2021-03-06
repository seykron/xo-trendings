import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

import './SlideFilters.scss';
import { appConfig } from '../../config';

const countryList = appConfig.countryList;
const Handle = Slider.Handle;

const handle = (props) => {
  const {value, dragging, index, ...restProps} = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

handle.propTypes = {
  value   : PropTypes.number,
  dragging: PropTypes.func,
  index   : PropTypes.number
};

function renderInput(inputProps) {
  const {InputProps, ref, ...other} = inputProps;
  return (
    <TextField
      InputProps={{
        inputRef: ref,
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderSuggestion({suggestion, index, itemProps, highlightedIndex, selectedItem}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.name}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.name}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index           : PropTypes.number,
  itemProps       : PropTypes.object,
  selectedItem    : PropTypes.string,
  suggestion      : PropTypes.shape({name: PropTypes.string}).isRequired
};

class SlideFilters extends Component {
  constructor(props) {
    super(props);

    this.youtubeService = this.props.services.youtubeService;
  }

  close() {
    this.props.close();
  }

  filterAndUpdate() {
    this.props.onChanges();
  }

  componentDidMount() {
    this.youtubeService.listCategories().then(newCategories => {
      this.setState({
        categories: newCategories,
        currentCategory: newCategories.find(category =>
          category.id === this.props.config.currentCategoryId
        ),
        currentRegion: countryList.find(country =>
          country.code === this.props.config.currentRegion
        )
      });  
    }).catch(error => {
      throw new Error('Error retrieving categories from Youtube Data API.');
    });
  }

  render() {
    const videosToLoadChange = (val) => {
      this.props.config.maxVideosToLoad = val;
      this.filterAndUpdate();
    };
    const updateRegion = countryName => {
      const region = countryList.find(country =>
        country.name === countryName
      );
      this.props.config.currentRegion = region.code;
      this.filterAndUpdate();
    };
    const updateCategory = categoryName => {
      const resolvedCategory = this.state.categories.find(category =>
        category.name === categoryName
      );
      this.props.config.currentCategoryId = resolvedCategory.id;
      this.filterAndUpdate();
    };

    return (
      <div className="slide-filters-container">
        <h3 className="title">
          Filters
          <Button className="mat-icon-button">
            <CloseIcon aria-label="Close" onClick={ () => this.close() } />
          </Button>
        </h3>
        <Downshift id="countrySelect" selectedItem={this.state && this.state.currentRegion && this.state.currentRegion.name} onChange={ regionCode => updateRegion(regionCode) }>
          {({
              getInputProps,
              getItemProps,
              getMenuProps,
              highlightedIndex,
              isOpen,
              selectedItem
            }) => (
            <div>
              {renderInput({
                fullWidth : true,
                InputProps: getInputProps(),
                label     : 'Select Country'
              })}
              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper square>
                    {countryList.map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({item: suggestion.name}),
                        highlightedIndex,
                        selectedItem
                      })
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
        <div className="divider"/>
        <Downshift id="categorySelect" selectedItem={this.state && this.state.currentCategory && this.state.currentCategory.name} onChange={ category => updateCategory(category) }>
          {({
              getInputProps,
              getItemProps,
              getMenuProps,
              highlightedIndex,
              isOpen,
              selectedItem,
              clearItems
            }) => (
            <div>
              {renderInput({
                fullWidth : true,
                InputProps: getInputProps(),
                label     : 'Select Category'
              })}
              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper square>
                    { 
                      clearItems() || this.state.categories.map((suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: getItemProps({item: suggestion.name}),
                          highlightedIndex,
                          selectedItem
                        })
                      )
                    }
                  </Paper>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
        <div className="divider"/>
        <div className="videosCountPerPage">
          <div className="caption">Count of videos on the page</div>
          <div className="slider">
            <Slider
              min={1}
              max={200}
              defaultValue={this.props.config.maxVideosToLoad}
              handle={handle}
              onAfterChange={videosToLoadChange}/>
          </div>
        </div>
      </div>
    );
  }
}

SlideFilters.propTypes = {
  config   : PropTypes.object,
  onChanges: PropTypes.func,
  close    : PropTypes.func,
  services : PropTypes.object
};

export default SlideFilters;
