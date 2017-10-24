"use strict"
import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    FlatList,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    TouchableOpacity,
    PermissionsAndroid,
    Dimensions,
    RefreshControl,
    Alert,
    ActivityIndicator,
    ToastAndroid,
    Image,
    ImageBackground
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';

import appStyles from '../../appStyles';
import appVars from '../../appVars';

import TimerMixin from 'react-timer-mixin';
import RNFetchBlob from 'react-native-fetch-blob';
import store from 'react-native-simple-store';
import PSPDFKit from 'PSPDFKit';

const CONFIGURATION = {
  scrollContinuously : false,
  showPageNumberOverlay : true,
  pageScrollDirection : "vertical"
};

const dirs = RNFetchBlob.fs.dirs;

class HomeScreen extends Component{

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: [],
      page: 1,
      error: null,
      refreshing: false,
      downloading: false,
      currentItem: null
    }
  }
  componentDidMount=()=>{
    if(Platform.OS === 'android') {
      this.getPermissions();
    }
    this.fetchdata();
    TimerMixin.setInterval (
      () => {
        if(!this.state.downloading){
        this.handleRefresh();  }
      },
      appVars.apiRefreshTime
    );
  }

fetchdata = async () => {
  const { page } = this.state;
  const api = appVars.apiUrl+"/epaper.html?authtoken="+appVars.apiKey+"&limit="+appVars.apiEpaperLimit+"&pid="+appVars.apiEpaperArchives;
  let tempapi= api+"&page_n120=" + this.state.page.toString();
  this.setState({ loading: true});


  if(this.state.refreshing){
    fetch(tempapi)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.response || [],
          error: res.error || null,
          loading : false,
          refreshing: false,
        })
      })
      .catch(error => {
        this.setState({ error, loading: false });
      })
    } else {
      fetch(tempapi)
        .then(res => res.json())
        .then(res => {
          this.setState({
            data: [...this.state.data, ...res.response],
            error: res.error || null,
            loading : false,
            refreshing: false,
          })
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
    }
};

  downloadFile = async (item)=>{
    let downloadFile = true;
    //let issues = await store.get('userIssues');
      var myissues = await store.get('userIssues');

    const { navigation } = this.props;
    myissues = myissues||[];
    for(let i=0;i<myissues.length;i++){
      if(myissues[i].id==item.id){
         downloadFile = false;
        
         PSPDFKit.present(myissues[i].path, CONFIGURATION);
        break;
      }
    }
    //console.log(url);

    if(downloadFile){
      this.setState({
        downloading: true
      });
      
      try {
        
      const pdfSource = appVars.downloadApiUrl +"/"+item.downloadPath;        
      let resp = await RNFetchBlob
      .config({
        //path: RNFetchBlob.fs.dirs.DownloadDir+"/dummy.pdf",
        fileCache: false,
        path: RNFetchBlob.fs.dirs.DocumentDir+"/epaper/"+item.downloadPath,
          addAndroidDownloads : {
              useDownloadManager : true, // <-- this is the only thing required
              // Optional, override notification setting (default to true)
              notification : true,
              // Optional, but recommended since android DownloadManager will fail when
              // the url does not contains a file extension, by default the mime type will be text/plain
              mime : 'application/pdf',   
              description : 'File downloaded by download manager.',
              //path: RNFetchBlob.fs.dirs.DownloadDir+"/dummy.pdf",
              path: RNFetchBlob.fs.dirs.DownloadDir+"/"+item.id,
              mediaScannable : true,
          }
      })
      .fetch('GET', pdfSource);

      const imageSource = appVars.downloadApiUrl +"/"+item.singleSRC;
      let imageResp = await RNFetchBlob
      .config({
        path: RNFetchBlob.fs.dirs.DocumentDir+"/epaper/"+item.singleSRC,
        fileCache: false,        
          addAndroidDownloads : {
              useDownloadManager : true, // <-- this is the only thing required
              // Optional, override notification setting (default to true)
              notification : true,
              // Optional, but recommended since android DownloadManager will fail when
              // the url does not contains a file extension, by default the mime type will be text/plain
              mime : 'image/jpeg',
              description : 'File downloaded by download manager.',
              //path: RNFetchBlob.fs.dirs.DownloadDir+"/dummy.pdf",
              path: RNFetchBlob.fs.dirs.DownloadDir+"/"+item.singleSRC,
              mediaScannable : true,
          }
      })
      .fetch('GET', imageSource);
      
      const issueObject = {
        path: resp.path(),
        thumbNail: imageResp.path(),
        thumbNailWidth: item.width,
        thumbNailHeight: item.height,
        date: item.date,
        epaperindex: item.epaperindex,
        id: item.id
      };
      //Alert.alert(resp.path());
      //Alert.alert("Download Successful");
      store.push('userIssues',issueObject );
      PSPDFKit.present(resp.path(), CONFIGURATION);
    } catch (error) {
      Alert.alert("error in download. PLease try again later.");
      console.log("error in download");
      console.log(error);
      
    }
      finally{
        this.setState({
          downloading: false
        });
      }
    }
  }

  getPermissions = async ()=>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        { 'title': 'Read write permission',
        'message': 'RW permission' } )
        if (granted === PermissionsAndroid.RESULTS.GRANTED)
        { console.log("You can use the sdcard") }
         else
         { console.log("permission denied") } }
         catch (err) { console.warn(err) }
  }


  handleRefresh = () =>{
    this.setState({
      page: 1,
      refreshing:true,
    }, ()=>{
      this.fetchdata();
    })
  }

  handlePageEnd = ()=>{
    this.setState({
      page: this.state.page+1,
    }, ()=>{
      this.fetchdata();
    });
  }

  handleClick = async (item)=>{
    if(this.state.downloading){
      ToastAndroid.show(appVars.textDownloadAllreadRunning, ToastAndroid.SHORT);
      return;
    }
    if(item.paywall){
      const userToken = await store.get(appVars.STORAGE_KEY);
      if(!userToken){
        const { navigation } = this.props;
        navigation.navigate('Account');
        return;
      }

    }
    this.setState({
      currentItem: item.id
    });
    this.downloadFile(item);
  }

  ratioImageHeigh = (width,height,multiplicate) =>{
    return height*(appVars.screenX*multiplicate/width);
  }
  ratioImageWidth = (width,height,multiplicate) =>{
    return width*(appVars.screenY*multiplicate/height);
  }

  renderItem = (item) =>{
    return(
      <View style={appStyles.ePaperEditionWrapper}>
        <TouchableOpacity style={appStyles.imageBorder} activeOpacity = { .5 } onPress={ this.handleClick.bind(this,item)}>
            
              <ImageBackground 
                  style={{width: ((appVars.screenX*.21)), height: this.ratioImageHeigh(item.width,item.height,.21)}}
                  source={{uri: appVars.apiUrl +"/"+item.picture.img.src} }
                  >
            {(item.paywall)?<View><View style={appStyles.paywallIconTriangle} /><AwseomeIcon style={appStyles.paywallIcon} name="plus" /></View>:<View></View>}
            {(this.state.downloading && (this.state.currentItem==item.id))?<ActivityIndicator style={appStyles.ePaperActivityIndicator} size="large" color={appVars.colorMain}/>:<View></View>}
            </ImageBackground>
           <Text style={appStyles.ePaperEditionDate}>{item["date"]}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderItemNewst = (item) =>{
    return(
      <View style={appStyles.ePaperMainWrapper}>
        <TouchableOpacity style={appStyles.imageBorder} activeOpacity = { .5 } onPress={ this.handleClick.bind(this,item)}>
          <ImageBackground style={{width: this.ratioImageWidth(item.width,item.height,.75)-55, height: ((appVars.screenY*.75)-120)}}
                  source={{uri: appVars.apiUrl +"/"+item.singleSRC} }>
          {(item.paywall)?<View><View style={appStyles.paywallIconTriangle} /><AwseomeIcon style={appStyles.paywallIcon} name="plus" /></View>:<View></View>}
          {(this.state.downloading && (this.state.currentItem==item.id))?<ActivityIndicator style={appStyles.ePaperActivityIndicator} size="large" color={appVars.colorMain}/>:<View></View>}
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }
	render()
	{
    const mainItem = [];
    if(this.state.data.length){
      
      mainItem.push(this.state.data[0]);
    }
    return (
      <View>
      <View style={appStyles.ePaperMainContainer}>
      <FlatList
        data={mainItem}
        numColumns={1}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            colors={[appVars.colorMain]}
          />
          }
        keyExtractor={(item,index)=> {
          return item.id;
          }}
        renderItem={({item}) => this.renderItemNewst(item)}
       />
      </View>
      <View style={appStyles.ePaperHorizontalContainer}>
      <FlatList
        data={this.state.data.slice(1)}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onEndReached={this.handlePageEnd}
        onEndReachedThreshold={0.5}
        keyExtractor={(item,index)=> { 
          return item.id;
          }}
        renderItem={({item}) => this.renderItem(item)}
       />
       </View>
      </View>
    );
	}
}

export default HomeScreen;
