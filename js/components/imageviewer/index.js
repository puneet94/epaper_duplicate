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
      let images = navParams.images.map((temp)=>{
        //return appVars.apiUrl +'/'+temp.sources[0].src;
        return {source: { uri: appVars.apiUrl +'/'+temp.sources[0].src },dimensions:{width:temp.sources[0].width,height:temp.sources[0].height} }
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
          { source: { uri: appVars.apiUrl +'/'+item.singleSRC } },
        ]
      };
    }
      this.onChangeImage = this.onChangeImage.bind(this);

  }
/*componentDidMount(){
    //this.fetchgallerydata();
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
  };*/

  onChangeImage (index) {
    this.setState({ index });
  }
/*
  ArrImages (apiresonse) {
    const newArrImages = [];
    console.log("response from api");
    console.log(apiresonse);
    apiresonse.map((temp)=>{
      newArrImages.push({source: { uri: appVars.apiUrl +'/'+temp.sources[0].src } })
      })
      return newArrImages;
  }*/

  renderError () {
    return (
        <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
             <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>This image cannot be displayed...</Text>
             <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>... but this is fine :)</Text>
        </View>
    );
}

get galleryCount () {
  const { index, images } = this.state;
  return (
      <View style={{ top: 0, height: 65, backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', position: 'absolute', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'right', color: 'white', fontSize: 15, fontStyle: 'italic', paddingRight: '10%' }}>{ index + 1 } / { images.length }</Text>
      </View>
  );
}

      render() {
        
          return (
              <View style={appStyles.contenContainer}>
                <Gallery
                  initialPage={this.state.initialPage}
                  style={{ flex: 1, backgroundColor: appVars.colorBlack}}
                  images={this.state.images}
                  errorComponent={this.renderError}
                  onPageSelected={this.onChangeImage}
                  
                />
                { this.galleryCount }
              </View>
          )
    }
  }

export default ImageViewerScreen;