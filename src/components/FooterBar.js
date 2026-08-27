import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {propTypesTemplate} from '../templates/typesFooterBar.js'

class FooterBar extends React.Component {

   constructor(props) {
      super(props);
   }


   render() {

      return (
         <div  style = {{width: "100%", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}
               className = "themeBorderDefault themeTextDefault themeShadowDefault themeBackgroundGreyDarkNoHover noPadding">

               <div style = {{marginLeft: "3%", fontSize: "20px"}}>
                  <div>
                     {this.props.playerInfo.displayName} · {formatFaction(this.props.playerInfo.faction)}
                  </div>
               </div>
               <div  style = {{marginRight: "3%"}}
                     className = "themeBackgroundDefault themeBorderDefault themeShadowDefault"
                     onClick = {this.props.handleShopClicked}>
                     Shop
               </div>

         </div>

      )
   }
}

function formatFaction(faction) {
   return faction.toLowerCase() === "uef"
      ? "UEF"
      : faction.charAt(0).toUpperCase() + faction.slice(1).toLowerCase();
}

FooterBar.propTypes = propTypesTemplate;
export {FooterBar};
