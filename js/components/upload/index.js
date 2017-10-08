import React, { Component } from 'react'
import { StyleSheet,
    TouchableHighlight,
    Dimensions,
    View,
    Text } from 'react-native'
import appStyles from '../../appStyles';

class UploadScreen extends Component {

      render() {
          return (
              <View style={appStyles.container}>
                <Text>A user can upload here a file from its camera roll or from its internal storage to our server.</Text>
              </View>
          )
    }
  }

export default UploadScreen;
