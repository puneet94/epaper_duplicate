import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';

import appVars from './appVars';
import appStyles from './appStyles';

import MenuScreen from './components/menu';
import PDFViewScreen from "./components/pdfview";

const ePaperApp = StackNavigator({
    Menu : {
      screen: MenuScreen,
      navigationOptions: ({navigation}) => ({
        headerStyle: appStyles.headerWrapper,
        headerTitleStyle: appStyles.headerTitle,
        headerLeft: <AwseomeIcon name="bars" style={appStyles.headerIcon} onPress={() => {
        if (navigation.state.index === 0) {
          navigation.navigate('DrawerOpen')
        } else {
          navigation.navigate('DrawerClose')
        }
      }} />
    }),
  },
  PDFView: {
    screen: PDFViewScreen,
    navigationOptions : ({ navigation }) => ({
      headerTitle: 'PDF',
      headerStyle: appStyles.headerWrapper,
      headerTitleStyle: appStyles.headerTitle,
    }),
  },
});

export default ePaperApp;
