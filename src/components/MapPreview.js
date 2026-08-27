import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {propTypesTemplate} from '../templates/typesMapPreview.js'

class MapPreview extends React.Component {
   /*props: an object of the class InpSelector
   */
   constructor(props) {
      super(props);

   }

   render() {
      var displayString =   this.props.mapName.toString() + " - "
                        + (this.props.maxPlayers / 2).toString() + "v" + (this.props.maxPlayers / 2).toString() + " - "
                        + this.props.mapSize.toString() + "km"


      return (
         <div id='mapbox' className = "themeBackgroundDefault themeBorderDefault themeTextDefault themeShadowDefault">
   			{displayString}
			<img  id='map' alt={this.props.mapName} className = "themeBorderDefault" src = {this.props.mapImg} />
   		</div>
      )
   }
}

MapPreview.propTypes = propTypesTemplate;
export {MapPreview};
