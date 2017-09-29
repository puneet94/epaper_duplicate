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
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  height: 6,
},

drawerItem: {
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  padding: 15,
},

drawerIcon: {
    color: appVars.colorWhite,
    fontSize: 22,
    width: 25,
    textAlign: 'center',
},

drawerLabel: {
  fontSize: 18,
  fontFamily: appVars.fontMain,
  color: appVars.colorWhite,
  paddingLeft: 8,
  fontWeight: 'bold',
},

//header
  headerWrapper: {
      backgroundColor: appVars.colorWhite,
  },
  headerIcon: {
      color: appVars.colorBlack,
      fontSize: 20,
      paddingLeft: 15,
  },

});
