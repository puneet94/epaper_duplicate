"use strict"
import React, { Component } from 'react'
import {
  View,
  Text,
  ActivityIndicator
} from 'react-native'

import appStyles from '../../appStyles';
import appVars from '../../appVars';
import Gallery from '../../core/gallery';

class ImageViewerScreen extends Component {
  constructor (props) {
    super(props);
    const navParams = this.props.navigation.state.params;
    let item = navParams.item;
    let newsid = navParams.newsid;

    if(newsid) {
      let images = navParams.images.map((temp)=>{
        return appVars.apiUrl +'/'+temp.sources[0].src;
        //return {source: { uri: appVars.apiUrl +'/'+temp.sources[0].src },dimensions:{width:temp.sources[0].width,height:temp.sources[0].height} }
        //return {source: { uri: appVars.apiUrl +'/'+temp.sources[0].src },dimensions:{width:400,height:400} }
        });
      this.state = {
        index: 0,
        page: 0,
        initialPage: navParams.initialPage,
        images
      };

    } else {
      this.state = {
        index: 0,
        page: 0,
        initialPage: navParams.initialPage,
        images: [
           appVars.apiUrl +'/'+item.singleSRC 
        ]
      };
    }
      this.onChangeImage = this.onChangeImage.bind(this);

  }
  onChangeImage (index) {
    this.setState({ index });
  }
      render=()=> {
        
          return (
              <View style={appStyles.contenContainer}>
                <Gallery
                style={{flex: 1, backgroundColor: 'black'}}
                images={this.state.images}
                initialPage = {this.state.initialPage}
              />
              </View>
          )
    }
  }

export default ImageViewerScreen;