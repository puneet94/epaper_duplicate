"use strict"
import React, { Component } from 'react'
import {
  View,
  Text,
  ActivityIndicator
} from 'react-native'

import appStyles from '../../appStyles';
import appVars from '../../appVars';
import Gallery from 'react-native-image-gallery';


class ImageViewerScreen extends Component {
  constructor (props) {
    super(props);
    const navParams = this.props.navigation.state.params;
    let item = navParams.item;
    let newsid = navParams.newsid;
    if(newsid) {
      this.state = {
        index: 0,
        initialPage: 0,
        images: [],
      };
    } else {
      this.state = {
        index: 0,
        initialPage: 0,
        images: [
          { source: { uri: appVars.apiUrl +'/'+item.singleSRC } },
        ]
      };
    }
      this.onChangeImage = this.onChangeImage.bind(this);
  }

componentDidMount(){
    this.fetchgallerydata();
  }

  fetchgallerydata = async () => {
    const navParams = this.props.navigation.state.params;
    const api = appVars.apiUrl+"/gallery.html?authtoken="+appVars.apiKey+"&id="+navParams.newsid;
    let tempapi= api;
        fetch(tempapi)
          .then(res => res.json())
          .then(res => {            
            this.setState({
              images: this.ArrImages(res.response),
            })
          })
          .catch(error => {
            this.setState({ error});
          });
  };

  onChangeImage (index) {
    this.setState({ index });
  }

  ArrImages (apiresonse) {
    const newArrImages = [];
    apiresonse.map((temp)=>{
      newArrImages.push({source: { uri: appVars.apiUrl +'/'+temp.sources[0].src } })
      })
      return newArrImages;
  }
  
      render() {
        console.log(this.state.images);
          return (
              <View style={appStyles.contenContainer}>
                <Gallery
                  style={{ flex: 1, backgroundColor: 'black' }}
                  images={this.state.images}
                  errorComponent={this.renderError}
                  onPageSelected={this.onChangeImage}
                  initialPage={0}
                />
              </View>
          )
    }
  }

export default ImageViewerScreen;