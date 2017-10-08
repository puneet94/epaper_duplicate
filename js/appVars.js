import {Platform, Dimensions} from 'react-native';

const ScreenWidth = Dimensions.get('window').width;

  // WTF - needs to edit the Mafra font name
  if(Platform.OS === 'android') {
    var fontHeadline = "MafraCondensedDeckMedium";
    var shareIcon = 'md-share';
  } else {
    var fontHeadline = "Mafra Condensed Deck";
    var shareIcon = 'ios-share-outline';
  }

  const ObjNewsCategories  = [
    { archive: 'demo', label: 'Demo'},
    { archive: 'allem', label: 'Start'},
    { archive: 'einbeck', label: 'Einbeck'},
    { archive: 'dassel', label: 'Dassel'},
    { archive: 'kreiensenem', label: 'Kreiensen'},
    { archive: 'regionem', label: 'Region'},
    { archive: 'sportem', label: 'Sport'},
    { archive: 'polizeiem', label: 'Blaulicht'}
  ];

module.exports = {

  apiUrl: "https://api.mopo-server.de",
  apiKey: "04a0a1ca18a1beaa24dfcecfe224d53f",

  // we can change now the limit of items. like get 4 items on phones and like 8 on tablets...
  // How many epaper-items should be grabbed per call.
  apiEpaperLimit: "4",
  // which epaper-archives should be shown
  apiEpaperArchives: "9,10",

  // Settings for the new Newsfeed
  // How many newsitems should be grabbed per call.
  apiNewsLimit: "5",
  NewsArchivesFallback: "demo",
  objNewsCategories: ObjNewsCategories,

  apiRefreshTime: 5*1000,
  serverurl: "https://mopo-server.de",
  forgotpasswordurl: "https://www.einbecker-morgenpost.de/login/passwort-vergessen.html",

  // Youtube API KEY
  YoutubeAPIKey: "AIzaSyDnHRcAVdm_hLVvZNTIBCucsaKMggJeGaU",
  
  // icons
  shareIcon: shareIcon,
  
  //drawerWidth
  drawerWidth: ScreenWidth*0.69,

  //colors
  colorWhite: "#ffffff",
  colorBlack: "#000000",
  colorMain: "#006633",
  colorActive: "#cc0000",
  colorLightGray: "#cccccc",
  colorDarkGray: "#333333",
  colorSeperatorColor: "rgba(0, 0, 0, 0.1)",
  colorDrawerIsActiveBackgroundColor: "rgba(0, 0, 0, 0.3)",
  colorDrawerSeperatorBackgroundColor: "rgba(0, 0, 0, 0.1)",

  //fonts
  fontMain: "GothamNarrow-Bold",
  fontSub: "GothamNarrow-Book",
  fontHeadline: fontHeadline,
  fontText: "CandidaStd-Roman",

  //labels
  labelHome: "Home",
  labelMyIssues: "My issues",
  labelNewsList: "Newsfeed",
  labelUpload: "Upload",
  labelSettings: "Settings",
  labelAccount: "Account",

  labelDelete: "Delete",
  labelCancel: "Cancel",
  
  //text
  textDownloadAllreadRunning: "Download already in progress. Please wait for it to finish.",
  textNoIssueSelected: "No issue selected",
  textDeleteIssues: "Delete Issues",
  //textComfirmDeleteIssues: "Are you sure you want to delete these"+${this.state.deletedIssues.length}+"issues",
  
  STORAGE_KEY : 'TOKEN',

}
