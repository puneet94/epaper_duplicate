/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  StatusBar,
  Platform,
  WebView
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Camera from 'react-native-camera';


class HomeScreen extends React.Component {

  render() {
    const { navigate } = this.props.navigation;
    return (

      <View style={styles.container}>
      <StatusBar backgroundColor="#006643" barStyle="light-content"/>

      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}
        type={Camera.constants.Type.back}
        captureQuality={Camera.constants.CaptureQuality.low}
        captureTarget={Camera.constants.CaptureTarget.temp}>
        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[IMAGE]</Text>
      </Camera>
      </View>
    );
}

takePicture() {

  const { navigate } = this.props.navigation;
   this.camera.capture()
     .then((data) => {
        navigate('Wait');
         PicturePath = data.path;

         if (PicturePath) {
           var data = new FormData();
           data.append('token', 'ad1e11df59cd443c');
           data.append('image', { uri: PicturePath, name: 'image.jpg', type: 'image/jpg' });

           const config = {
            method: 'POST',
            dataType: 'jsonp',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data;'
            },
            body: data,
           }


           fetch("https://search.craftar.net/v1/search", config)
            .then((responseData) => {
                var data = JSON.parse(responseData._bodyInit).results[0].item;
                var url = data.url;
                console.log(data);
                if(url) {
                    navigate('Browser', { link: url });
                } else {

                    navigate('Home');
                }


            })
            .catch(err => {
              console.log(err);
            })


       }

     })
     .catch(err => console.error(err));
  }

}


class BrowserScreen extends React.Component {
  static navigationOptions = {
    title: 'Browser',
  };
  render() {
    const { params } = this.props.navigation.state;
    console.log(params.link);
    return (
      <WebView
      source={{uri: params.link}}
      renderLoading={this.renderLoading}
      startInLoadingState={true} />
    );
  }
}

class WaitScreen extends React.Component {
  static navigationOptions = {
    title: 'Bitte warten...',
  };
  render() {
    const { params } = this.props.navigation.state;

    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const emar = StackNavigator({
  Home: { screen: HomeScreen,
          headerMode: 'none',
          header: null,
          navigationOptions: {
            header: null
          }
        },
  Wait: { screen: WaitScreen },
  Browser: { screen: BrowserScreen},
});

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'row',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      color: '#000',
      padding: 10,
      margin: 40
    },
    indi: {alignItems: 'center',
        justifyContent: 'center'}
});

AppRegistry.registerComponent('emar', () => emar);
