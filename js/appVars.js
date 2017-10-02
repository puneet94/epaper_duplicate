import {Platform, Dimensions} from 'react-native';

const ScreenWidth = Dimensions.get('window').width;

module.exports = {

  apiUrl: "https://api.mopo-server.de",
  apiKey: "04a0a1ca18a1beaa24dfcecfe224d53f",
  // we can change now the limit of items. like get 4 items on phones and like 8 on tablets...
  apiLimit: "4",
  // which epaper archives should be shown
  apiArchives: "9,10",


  serverurl: "https://mopo-server.de",
  forgotpasswordurl: "https://www.einbecker-morgenpost.de/login/passwort-vergessen.html",

  //drawerWidth
  drawerWidth: ScreenWidth*0.69,

  //colors
  colorWhite: "#ffffff",
  colorBlack: "#000000",
  colorMain: "#006633",
  colorDrawerIsActiveBackgroundColor: "rgba(0, 0, 0, 0.3)",
  colorDrawerSeperatorBackgroundColor: "rgba(0, 0, 0, 0.1)",

  //fonts
  fontMain: "GothamNarrow-Medium",

  //labels
  labelHome: "Home",
  labelMyIssues: "My issues",
  labelAccount: "Account",

  STORAGE_KEY : 'TOKEN',

}
