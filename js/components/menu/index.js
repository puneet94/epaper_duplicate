'use strict';
import React, { Component } from 'react';
import{Image,ScrollView} from "react-native";
import { DrawerNavigator } from 'react-navigation';


import ePaperScreen from "../epaper";
import IssuesScreen from "../myissues";
import NewsListScreen from "../newslist";
import GalleryListScreen from "../gallerylist";
import UploadScreen from "../upload";
import AccountScreen from "../account";
import SettingsScreen from "../settings";
import ImprintScreen from "../imprint";
import PrivacyPolicyScreen from "../privacypolicy";
import DrawerContainer from "./DrawerContainer";

import appVars from '../../appVars';
import appStyles from '../../appStyles';

const Menu = DrawerNavigator({
  NewsList: {
    screen: NewsListScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitleStyle: appStyles.headerTitle,    
      headerTitle: appVars.labelNewsList.toUpperCase(),
    }),
  },
  GalleryList: {
    screen: GalleryListScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelGalleryList.toUpperCase(),
    }),
  },
  epaper: {
    screen: ePaperScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelePaper.toUpperCase(),
    }),
  },
  MyIssues: {
    screen: IssuesScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelMyIssues.toUpperCase(),
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
  Imprint: {
    screen: ImprintScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelImprint.toUpperCase(),
    }),
  },
  PrivacyPolicy: {
    screen: PrivacyPolicyScreen,
    navigationOptions : ({ navigation, screenProps }) => ({
      headerTitle: appVars.labelPrivacyPolicy.toUpperCase(),
    }),
  },

},
{
  contentComponent: DrawerContainer,
  drawerWidth: appVars.drawerWidth,
}
);

export default Menu;
