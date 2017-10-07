import {StyleSheet, Platform, Dimensions} from 'react-native';
import appVars from './appVars';

// Precalculate Device Dimensions for better performance
const x = Dimensions.get('window').width;
const y = Dimensions.get('window').height;

// Calculating ratio from iPhone breakpoints
const ratioX = x < 375 ? (x < 320 ? 0.75 : 0.875) : 1;
const ratioY = y < 568 ? (y < 480 ? 0.75 : 0.875) : 1;

// We set our base font size value
const base_unit = 16;

// Simulating EM by changing font size according to Ratio
const unit = base_unit * ratioX;

// We add an em() shortcut function
function em(value) {
  return unit * value;
}


module.exports = StyleSheet.create({
  //epaper (home)

  ePaperMainContainer: {
    backgroundColor: appVars.colorWhite,
    height: (y * .75)-80,
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 1,
    borderBottomColor: 'black',
    elevation : 5,
  },
  ePaperMainWrapper: {
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ePaperHorizontalContainer: {
    backgroundColor: appVars.colorSeperatorColor,
  },
  ePaperEditionWrapper: {
    height: (y * .25),
    width: (x * .25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ePaperEditionDate:{
    backgroundColor: appVars.colorMain,
    color: appVars.colorWhite,
    textAlign: 'center',
    fontSize: em(0.666),
    padding: 3,
    fontFamily: appVars.fontMain,
    justifyContent: 'center',
    alignItems: 'center'
  },


  //newsdetail
  topheadlineContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    alignSelf: 'center',
  },
  topheadline: {
    fontSize: em(0.75),
    fontFamily: appVars.fontMain,
    color: '#666',
  },
  headline: {
    fontSize: em(2.250),
    fontFamily: appVars.fontHeadline,
    color: appVars.colorBlack,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: em(1),
    fontFamily: appVars.fontSub,
    color: appVars.colorBlack,
    textAlign: 'center',
  },
  imagecopyright: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: em(0.750),
    color: appVars.colorWhite,
    textShadowColor: appVars.colorBlack,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    fontFamily: appVars.fontSub,
    backgroundColor: 'transparent',
  },
  imagecaption: {
    fontSize: em(0.875),
    fontFamily: appVars.fontSub,
    color: appVars.colorMain,
    marginBottom: em(0.875),
  },



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

  ePaperActivityIndicator: {
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
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appVars.colorWhite,
  },

  headerIcon: {
      color: appVars.colorMain,
      fontSize: 20,
  },


  // generall stuff

  imageBorder: {
    padding: 3,
    backgroundColor: appVars.colorWhite,
    borderColor: appVars.colorLightGray,
    borderWidth: 1,
  },

  paywallIconTriangle:{
    position: 'absolute',
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 32,
    borderTopWidth: 32,
    borderRightColor: 'transparent',
    borderTopColor: appVars.colorMain,
    transform: [
      {rotate: '90deg'}
    ]
  },

  paywallIcon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 2,
    top: 2,
    fontSize: 16,
    color: appVars.colorWhite,
  },

});
