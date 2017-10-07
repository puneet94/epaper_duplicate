import {StyleSheet, Platform, Dimensions} from 'react-native';
import appVars from './appVars';

const x = Dimensions.get('window').width;
const y = Dimensions.get('window').height;

// Calculating ratio from iPhone breakpoints
const ratioX = x < 375 ? (x < 320 ? 0.75 : 0.875) : 1;
const ratioY = y < 568 ? (y < 480 ? 0.75 : 0.875) : 1;

// base font size value
const base_unit = 16;

// Fake EM by changing font size according to Ratio
const unit = base_unit * ratioX;

// add an em() function
function em(value) {
  return unit * value;
}

// calcuate the lineHeight by the faked em and how many percent - lineHeight(0.825,140)
function lineHeight(value,lh) {
  return (unit * value)*(lh/100);
}

const teaser = StyleSheet.create({
  p: {
    fontSize: em(0.875),
    lineHeight: lineHeight(0.875,140),
    fontFamily: appVars.fontSub,
    color: appVars.colorBlack,
    marginBottom: em(0.875),
  },
  strong: {
    fontWeight: '700'
  },
  a: {
    color: appVars.colorMain,
    fontWeight: '700'
  },
  h3: {
    fontSize: em(1.250),
    lineHeight: lineHeight(1.250,120),
    fontFamily: appVars.fontHeadline,
    color: appVars.colorBlack,
    marginBottom: em(1),
  }
});

const text = StyleSheet.create({
  p: {
    fontSize: em(0.875),
    lineHeight: lineHeight(0.875,140),
    fontFamily: appVars.fontText,
    color: appVars.colorBlack,
    marginBottom: em(0.875),
    paddingLeft: 20,
    paddingRight: 20,
  },
  strong: {
    fontWeight: '700'
  },
  a: {
    color: appVars.colorMain,
    fontWeight: '700'
  },
  city: {
      fontSize: em(0.875),
      fontFamily: appVars.fontMain,
      color: '#333',
  },
  h3: {
    fontSize: em(1.250),
    lineHeight: lineHeight(1.250,120),
    fontFamily: appVars.fontHeadline,
    color: appVars.colorBlack,
    marginBottom: em(1),
  }
});

const htmlStyles = {teaser,text};

module.exports = htmlStyles;
