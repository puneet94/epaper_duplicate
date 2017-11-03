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
      textSelectionEnabled: false,
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
      searchMode: 'inline',
      thumbnailBarMode: 'scrollable',
      pageTransition: 'scrollPerSpread',
    };
    
    var PDFVIEWER_KEY = 'cZN9KGK7uEOYmVg7u8GnYZxj88r3e/gO1yfl19mCEvGYeCQphzxfWOMfN8ZpCHaxLwntquVSg/aeqf2R0X6OXwsEWKIBoiXGEsoJUWcVtzJr9tzRKRMxKLW1t/ijaSwTegHa8dYIViEaEnIh/7QDbkqU5a364IVOK2agObJmhKFohS/6JN3JyuoE0vLm9pQAe+VDS1z5MrJqqAl4SZUwHJtispY9GBiEDedmW6Ly/UuZP5ORr/gxeICujuVgs4ly0Ji1QsWdHUO2+3Z1W7lXW37DZxxCiwJGyJ1tCefse3KcEE4GDIcbNSf43WbSE+ZrMG/IdPvpZXiOp41tXPVkowESks0C0DtIao435lJ2V1WKCGMv3YoOIog418M+ImhiAbEfABBVFXocNSNPdzU9yl5ZO1vX+CH4eUDfZU5eDSRIxPTsJrt6SDtlCvbslSPA';
  }

  const ObjNewsCategories  = [
    { archive: 'allem', subMenuLabel: 'Lokales'},
    { archive: 'demo', subMenuLabel: 'Demo'},
    { archive: 'einbeck', subMenuLabel: 'Einbeck'},
    { archive: 'dassel', subMenuLabel: 'Dassel'},
    { archive: 'kreiensenem', subMenuLabel: 'Kreiensen'},
    { archive: 'regionem', subMenuLabel: 'Region'},
    { archive: 'sportem', subMenuLabel: 'Sport'},
    { archive: 'polizeiem', subMenuLabel: 'Blaulicht'}
  ];

  const htmlContentUpload = `<h3>1. Teilnahme</h3><p>Der Nutzer des Sofortmelders gewährt der Heinrich Rüttgerodt GmbH & Co. KG, nachfolgend Verlag genannt, mit Übermittlung von Texten und Fotos ein zeitlich und ortsunabhängiges, allerdings nicht exklusives Nutzungsrecht an den Inhalten. Der Verlag und damit sämtliche Tochtergesellschaften i. S. d. §§15 AktG werden zum Zeitpunkt der Übermittlung durch den Nutzer dazu ermächtigt, die übermittelten Inhalte für eigene Zwecke zu nutzen, zu vervielfältigen, zu verbreiten, drahtgebunden oder drahtlos zum Abruf bereitzustellen, zu archivieren und in Datenbanken zu speichern. Weiterhin ist der Verlag berechtigt, die Inhalte zu publizieren und zu bearbeiten, wenn dies zur grafischen Darstellung, aus redaktionellen Gründen und/oder zur Verbindung mit weiteren Werken notwendig ist.</p><p>Für den Nutzer entsteht mit Übermittlung seiner Inhalte kein Recht auf Veröffentlichung. Die Publikation der Inhalte liegt im Ermessen des Verlags und ist abhängig von der Relevanz und Qualität der Beiträge und Fotos. Wir weisen ausdrücklich darauf hin, dass für den Nutzer mit Einräumung der oben genannten Nutzungsrechte kein Anspruch auf die Zahlung eines Honorars besteht. Darüber hinaus werden Copyright-Vermerke nicht gestattet. Der Nutzer besitzt kein Recht auf Schadensersatzansprüche gegenüber dem Verlag.</p><h3>2. Ausgeschlossene Inhalte</h3><p>Ausgeschlossen von der Veröffentlichung sind Inhalte, die gegen deutsches Recht verstoßen und insbesondere:</p><p>a) Inhalte, die in die Rechte Dritter eingreifen, sofern der Nutzer nicht über eine formelle Lizenz oder Erlaubnis des Rechteinhabers verfügt, welche die Publikation ausdrücklich erlauben</p><p>b) Beiträge mit pornografischen, sittenwidrigen oder in sonstiger Weise anstößigen Inhalten</p><p>c) Beiträge, die von verfassungsfeindlichen, extremistischen oder sonstigen verbotenen Gruppierungen stammen</p><p>d) Beiträge, die strafbar, volksverhetzend oder in sonstiger Weise verboten sind</p><p>e) Beiträge, die unsachlich und unwahr sind</p><p>f) Beiträge, die dazu dienen, gewerbliche Produkte und Dienstleistungen zu bewerben.</p><h3>3. Gerichtsstand</h3><p>Der Gerichtsstand ist Einbeck.</p><h3>4. Datenschutz</h3><p>Für die Teilnahme am Sofortmelder ist es erforderlich, eine E-Mail-Adresse und/oder Telefonnummer anzugeben. Die von Ihnen eingegebenen persönlichen Daten werden gemäß unserer Datenschutzerklärung sehr sensibel behandelt. Wir gewährleisten Ihnen den höchstmöglichen Schutz dieser Daten.</p>`;

const APP_CONSTANTS =   {

  folder: "emepaper",

  screenX: ScreenWidth,
  screenY: ScreenHeight,  

  apiUrl: "https://api.mopo-server.de",
  downloadApiUrl: "https://files.mopo-server.de",
  apiKey: "04a0a1ca18a1beaa24dfcecfe224d53f",

  //
  // we can change now the limit of items. like get 4 items on phones and like 8 on tablets...
  // How many epaper-items should be grabbed per call.
  apiEpaperLimit: "5",
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

  apiRefreshTime: 15*60000,
  serverurl: "https://mopo-server.de",
  forgotpasswordurl: "https://www.einbecker-morgenpost.de/login/passwort-vergessen.html",

  // Youtube API KEY
  YoutubeAPIKey: "AIzaSyDnHRcAVdm_hLVvZNTIBCucsaKMggJeGaU",
  
  // Readspeaker API
  ReadspeakerUrl: "https://app-eu.readspeaker.com/cgi-bin/rsent?customerid=8397&lang=de_de&readid=readspeaker&url=",

  // icons
  shareIcon: shareIcon,
  
  //upload
  uploadAPISuccess: "Vielen Dank für Ihre Nachricht.",
  uploadAPIFail: "Ooops. Etwas hat nicht geklappt, bitte versuchen Sie es zu einem späteren Zeitpunkt noch einmal.",
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
  labelePaper: "ePaper",
  labelMyIssues: "Meine Ausgaben",
  labelNewsList: "Nachrichten",
  labelGalleryList: "Mediathek",
  labelUpload: "Direktmelder",
  labelSettings: "Einstellungen",
  labelAccount: "Benutzerkonto",
  labelImprint: "Impressum",
  labelPrivacyPolicy: "Datenschutz",
  labelEmail: "E-Mail",
  labelPhone: "Telefon-Nummer",
  labelPassword: "Passwort",
  labelTermsofuse: "Nutzungsbedingungen gelesen?",
  labelSubmit: "Absenden",

  labelDelete: "Löschen",
  labelCancel: "Abbrechen",
  
  labelPushnotifications: "Push-Nachrichten aktivieren?",
  labelFontsize: "Schriftgröße",

  labelLoginButton: "Anmelden",
  labelLogoutButton: "Abmelden",
  labelForgotPassword: "Passwort vergessen?",
  
  labelSelectPhoto: "Foto auswählen",
  labelSelectSource: "Bitte wählen Sie eine Fotoquelle",
  labelFromCamera: "Kamera",
  labelFromLib: "Album",
  labelMsg: "Nachricht",

  //text
  textDownloadAllreadRunning: "Bitte warten Sie bis der aktuelle Download abgeschlossen ist..",
  textNoIssueSelected: "Es wurde keine Ausgabe ausgewählt",
  textDeleteIssues: "Ausgabe löschen",
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

  textDownloadbyManager: "wird heruntergeladen.",
  textDownloadError: "Es ist ein Fehler aufgetreten./nVersuchen Sie es zu einem späteren Zeitpunkt erneut.",
  
  htmlUpload: htmlContentUpload,

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
