import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableWithoutFeedback
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';

import appVars from './appVars';
import appStyles from './appStyles';

import MenuScreen from './components/menu';
import PDFViewScreen from './components/pdfview';
import NewsDetailScreen from "./components/newsdetail";
import ImageViewerScreen from "./components/imageviewer";


const emdigitalApp = StackNavigator({
    Menu : {
      screen: MenuScreen,
      navigationOptions: ({navigation}) => ({
        headerStyle: appStyles.headerWrapper,
        headerTitleStyle: appStyles.headerTitle,
        headerLeft: <TouchableWithoutFeedback  onPress={() => {
          if (navigation.state.index === 0) {
            navigation.navigate('DrawerOpen')
          } else {
            navigation.navigate('DrawerClose')
          }
        }}>
          <View style={appStyles.iconWrapper} >
          {(navigation.state.index === 0)?
            <AwseomeIcon name="bars" style={appStyles.headerIcon} />:
            <AwseomeIcon name="close" style={appStyles.headerIcon} />}
          </View>
        </TouchableWithoutFeedback>
    }),
  },
  PDFView: {
    screen: PDFViewScreen,
    navigationOptions : ({ navigation }) => ({
    }),
  },
  NewsDetail: {
      screen: NewsDetailScreen,
      navigationOptions : ({ navigation }) => ({
      }),
  },
  ImageViewer: {
    screen: ImageViewerScreen,
    navigationOptions : ({ navigation }) => ({
    }),
},
});

export default emdigitalApp;
