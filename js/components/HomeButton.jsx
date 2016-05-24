/*
 * Copyright 2015-present Boundless Spatial Inc., http://boundlessgeo.com
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React from 'react';
import ol from 'openlayers';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import IconButton from 'material-ui/lib/icon-button';
import HomeIcon from 'material-ui/lib/svg-icons/maps/zoom-out-map';
import pureRender from 'pure-render-decorator';

const messages = defineMessages({
  buttontitle: {
    id: 'homebutton.buttontitle',
    description: 'Title for the home button',
    defaultMessage: 'Zoom to the initial extent'
  }
});

/**
 * A button to go back to the initial extent of the map.
 *
 * ```html
 * <div id='home-button'>
 *   <HomeButton map={map} />
 * </div>
 * ```
 */
@pureRender
class HomeButton extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.extent) {
      var view = this.props.map.getView();
      this._center = view.getCenter();
      this._resolution = view.getResolution();
      if (this._center === null) {
        view.once('change:center', function(evt) {
          this._center = evt.target.getCenter();
        }, this);
      }
      if (this._resolution === undefined) {
        view.once('change:resolution', function(evt) {
          this._resolution = evt.target.getResolution();
        }, this);
      }
    }
  }
  _goHome() {
    var view = this.props.map.getView();
    if (this.props.extent) {
      view.fit(this.props.extent, this.props.map.getSize(), {constrainResolution: false});
    } else if (this._center !== null && this._resolution !== undefined) {
      view.setCenter(this._center);
      view.setResolution(this._resolution);
    }
  }
  render() {
    const {formatMessage} = this.props.intl;
    return (
      <IconButton className='sdk-component home-button' tooltipPosition='top-right' style={this.props.style} tooltip={formatMessage(messages.buttontitle)} onTouchTap={this._goHome.bind(this)} ><HomeIcon color='white' /></IconButton>
    );
  }
}

HomeButton.propTypes = {
  /**
   * The ol3 map for whose view the initial center and zoom should be restored.
   */
  map: React.PropTypes.instanceOf(ol.Map).isRequired,
  /**
   * Extent to fit on the map on pressing this button. If not set, the initial extent of the map will be used.
   */
  extent: React.PropTypes.arrayOf(React.PropTypes.number),
  /**
   * Style for the button.
   */
  style: React.PropTypes.object,
  /**
   * i18n message strings. Provided through the application through context.
   */
  intl: intlShape.isRequired
};

HomeButton.defaultProps = {
  style: {
    background: 'rgba(0,60,136,.7)',
    borderRadius: '2px',
    width: '28px',
    height: '28px',
    padding: '2px'
  }
};

export default injectIntl(HomeButton);
