'use strict';
import React, { Component } from 'react';
import{Image,ScrollView} from "react-native";
import { DrawerNavigator } from 'react-navigation';


import HomeScreen from "../home";
import IssuesScreen from "../myissues";
import NewsListScreen from "../newslist";
import UploadScreen from "../upload";
import AccountScreen from "../account";
import SettingsScreen from "../settings";
import DrawerContainer from "./DrawerContainer";

import appVars from '../../appVars';
import appStyles from '../../appStyles';

const Menu = DrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelHome.toUpperCase(),
    }),
  },
  MyIssues: {
    screen: IssuesScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelMyIssues.toUpperCase(),
    }),
  },
  NewsList: {
    screen: NewsListScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelNewsList.toUpperCase(),
    }),
  },
  Upload: {
    screen: UploadScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelUpload.toUpperCase(),
    }),
  },
  Account: {
    screen: AccountScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelAccount.toUpperCase(),
    }),
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelSettings.toUpperCase(),
    }),
  },

},
{
  contentComponent: DrawerContainer,
  drawerWidth: appVars.drawerWidth,
}
);

export default Menu;
