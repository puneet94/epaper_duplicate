import {StyleSheet, Platform} from 'react-native';
import appVars from './appVars';
module.exports = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  instructions: {
    textAlign: 'center',
    color: appVars.colorMain,
    marginBottom: 5,
  },

  test: {
    flex: 1,
    backgroundColor:'rgba(255, 255, 255, 0.8)',
  },

//drawer

drawerContainer: {
  flex: 1,
  backgroundColor: appVars.colorMain,
},

drawerLogo: {
  width: null,
  height: 37,
  resizeMode: 'contain',
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 15,
  marginRight: 15,
  },

drawerSeperator: {
  backgroundColor: appVars.colorDrawerSeperatorBackgroundColor,
  height: 6,
},

drawerItem: {
  alignItems: 'center',
  flexDirection: 'row',
  padding: 15,
},

drawerIcon: {
    color: appVars.colorWhite,
    fontSize: 22,
    width: 25,
    height: 25,
    textAlign: 'center',
},

drawerLabel: {
  fontSize: 18,
  fontFamily: appVars.fontMain,
  color: appVars.colorWhite,
  paddingLeft: 8,
},

//header
  headerWrapper: {
      backgroundColor: appVars.colorWhite,
  },

  iconWrapper: {
    flex:1,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appVars.colorWhite,
  },
  headerIcon: {
      color: appVars.colorMain,
      fontSize: 20,
  },

});
