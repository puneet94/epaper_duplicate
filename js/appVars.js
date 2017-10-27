import {Platform, Dimensions, processColor} from 'react-native';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

  // WTF - needs to edit the Mafra font name
  if(Platform.OS === 'android') {
    var fontHeadline = "MafraCondensedDeckMedium";
    
    var shareIcon = 'md-share';
    var adArchives = '8';
    var animationType = 'slide';

    var PDFVIEWER_CONFIGURATION = {
      startPage: 0,
      showShareAction: false,
      showPrintAction: false,
      showThumbnailGridAction: false,
      showPageNumberOverlay : true,
      showAnnotationListAction: false,
      enableAnnotationEditing: false,
      showThumbnailBar: 'scrollable',
      HudViewMode: 'automatic',
      pageTransition: 'scrollPerSpread',
    };


  } else {
    // ios
    var fontHeadline = "Mafra Condensed Deck";
    
    var shareIcon = 'ios-share-outline';
    var adArchives = '7';
    var animationType = 'none';

    var PDFVIEWER_CONFIGURATION = {
      startPage: 0,
      backgroundColor: processColor('#FFFFFF'),
      textSelectionEnabled: 'NO',
      outlineButtonItem: 'NO',
      enableAnnotationEditing: 'NO',
      searchMode: 'inline',
      thumbnailBarMode: 'scrollable',
      pageTransition: 'scrollPerSpread',
    };
    
    var PDFVIEWER_KEY = 'cZN9KGK7uEOYmVg7u8GnYZxj88r3e/gO1yfl19mCEvGYeCQphzxfWOMfN8ZpCHaxLwntquVSg/aeqf2R0X6OXwsEWKIBoiXGEsoJUWcVtzJr9tzRKRMxKLW1t/ijaSwTegHa8dYIViEaEnIh/7QDbkqU5a364IVOK2agObJmhKFohS/6JN3JyuoE0vLm9pQAe+VDS1z5MrJqqAl4SZUwHJtispY9GBiEDedmW6Ly/UuZP5ORr/gxeICujuVgs4ly0Ji1QsWdHUO2+3Z1W7lXW37DZxxCiwJGyJ1tCefse3KcEE4GDIcbNSf43WbSE+ZrMG/IdPvpZXiOp41tXPVkowESks0C0DtIao435lJ2V1WKCGMv3YoOIog418M+ImhiAbEfABBVFXocNSNPdzU9yl5ZO1vX+CH4eUDfZU5eDSRIxPTsJrt6SDtlCvbslSPA';
  }

  const ObjNewsCategories  = [
    { archive: 'allem', subMenuLabel: 'Start'},
    { archive: 'demo', subMenuLabel: 'Demo'},
    { archive: 'einbeck', subMenuLabel: 'Einbeck'},
    { archive: 'dassel', subMenuLabel: 'Dassel'},
    { archive: 'kreiensenem', subMenuLabel: 'Kreiensen'},
    { archive: 'regionem', subMenuLabel: 'Region'},
    { archive: 'sportem', subMenuLabel: 'Sport'},
    { archive: 'polizeiem', subMenuLabel: 'Blaulicht'}
  ];

const APP_CONSTANTS =   {

  screenX: ScreenWidth,
  screenY: ScreenHeight,  

  apiUrl: "https://api.mopo-server.de",
  downloadApiUrl: "https://files.mopo-server.de",
  apiKey: "04a0a1ca18a1beaa24dfcecfe224d53f",

  //
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

  GalleryArchives: "mediaem",

  // Ad / Banner
  apiAdArchives: adArchives,

  apiRefreshTime: 5*1000000,
  serverurl: "https://mopo-server.de",
  forgotpasswordurl: "https://www.einbecker-morgenpost.de/login/passwort-vergessen.html",

  // Youtube API KEY
  YoutubeAPIKey: "AIzaSyDnHRcAVdm_hLVvZNTIBCucsaKMggJeGaU",
  
  // Readspeaker API
  ReadspeakerUrl: "https://app-eu.readspeaker.com/cgi-bin/rsent?customerid=8397&lang=de_de&readid=readspeaker&url=",

  // icons
  shareIcon: shareIcon,
  
  //upload
  uploadAPISuccess: "thank you for your feedback",
  uploadAPIFail: "Please try again",
  animationType : animationType,

  //drawerWidth
  drawerWidth: ScreenWidth*0.69,

  //BaseUnit
  baseUnit: 16,
  
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
  labelGalleryList: "Galleryfeed",
  labelUpload: "Upload",
  labelSettings: "Settings",
  labelAccount: "Account",
  labelEmail: "E-Mail",
  labelPhone: "Phone",
  labelPassword: "Passwort",
  labelTermsofuse: "Accepted Terms of use?",
  labelSubmit: "Submit",

  labelDelete: "Delete",
  labelCancel: "Cancel",
  
  labelPushnotifications: "Activate Push-Notifcations?",
  labelFontsize: "Your Fontsize",

  labelLoginButton: "login",
  labelLogoutButton: "logout",
  labelForgotPassword: "Reset password",
  
  labelSelectSource: "select source",
  labelFromCamera: "from camera",
  labelFromLib: "from photoalbum",
  labelMsg: "Message",

  //text
  textDownloadAllreadRunning: "Download already in progress. Please wait for it to finish.",
  textNoIssueSelected: "No issue selected",
  textDeleteIssues: "Delete Issues",
  //textComfirmDeleteIssues: "Are you sure you want to delete these"+${this.state.deletedIssues.length}+"issues",
  textPushnotificationsHeadline: "Push-Nachrichten",
  textPushnotifications: "Über unsere Push-Nachrichten werden Sie direkt über neue Ereignisse informiert. Sie können diesen Service jederzeit aktivieren oder deaktiveren.",
  textFontsizeHeadline: "Nachrichten Schriftgröße",
  textFontsize: "Hier können Sie die Schriftgröße nach Ihren Bedürfnissen anpassen.",

  textLogin: "Anmelden",
  textLoginFollowup: "Um auf unsere DigitalPlus-Inhalte zugreifen zu können, melden Sie sich bitte mit Ihrem Nutzerkonto an.",
  textLogout: "Sie sind angemeldet!",
  textLogutFollowup: "Sie können auf alle DigitalPlus-Inhalte zugreifen.",
  textErrorLogin: "Es ist ein Fehler aufgetreten. Überprüfen Sie Ihre Eingabe",

  textInstantNewsHeadline: "Direktmelder",
  textInstantNews: "Etwas Spannendes ist passiert und Sie sind mittendrin? Schicken Sie unsere Redaktion direkt einen Hinweis!",
  
  STORAGE_KEY : 'TOKEN',

  PDFVIEWER_KEY : PDFVIEWER_KEY,

  // keep in mind at the ConfigurationAdapter.java
  // LINE 279
  // configuration.hideSettingsMenu();
  // configuration.hideDocumentTitleOverlay();

  PDFVIEWER_CONFIGURATION : PDFVIEWER_CONFIGURATION,

}
import store from 'react-native-simple-store';
const getAppConstants = async (obj)=>{
  obj.baseUnit = await store.get('BASE_UNIT') || 18;
  //console.log("got from storage");
  //console.log(obj.baseUnit);
}
getAppConstants(APP_CONSTANTS);
module.exports = APP_CONSTANTS;
