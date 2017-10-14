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
    ToastAndroid
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import Image from 'react-native-scalable-image';

import appStyles from '../../appStyles';
import appVars from '../../appVars';

import TimerMixin from 'react-timer-mixin';
import RNFetchBlob from 'react-native-fetch-blob';
import store from 'react-native-simple-store';
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

  downloadFile = async (url,item)=>{
    let downloadFile = true;
    //let issues = await store.get('userIssues');
      var myissues = await store.get('userIssues');

    const { navigation } = this.props;
    myissues = myissues||[];
    for(let i=0;i<myissues.length;i++){
      if(myissues[i].id==item.id){
         downloadFile = false;

        navigation.navigate('PDFView', {file: myissues[i].path, epaperindex: myissues[i].epaperindex});
        break;
      }
    }
    //console.log(url);

    if(downloadFile){
      this.setState({
        downloading: true
      });
      //console.log("download started******************");

      let resp = await RNFetchBlob
      .config({
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
      .fetch('GET', url);
      const imageSource = appVars.apiUrl +"/"+item.singleSRC;
      let imageResp = await RNFetchBlob
      .config({
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

      this.setState({
        downloading: false
      });

      // if you wanna open the pdfview screen
      navigation.navigate('PDFView', {file: resp.path(), epaperindex: item.epaperindex});

      const issueObject = {
        path: resp.path(),
        thumbNail: imageResp.path(),
        date: item.date,
        epaperindex: item.epaperindex,
        id: item.id
      };
      
      store.push('userIssues',issueObject );
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
    this.downloadFile('https://mopo-server.de/'+ item["downloadPath"], item);
  }

  renderItem = (item) =>{
    //use now smaller (less kb and smaller ins size) thumbnails from the api
    //console.log(appVars.apiUrl +"/"+item.picture.img.src);

    return(
      <View style={appStyles.ePaperEditionWrapper}>
        <TouchableOpacity style={appStyles.imageBorder} activeOpacity = { .5 } onPress={ this.handleClick.bind(this,item)}>
            <Image maxHeight={Dimensions.get('window').height*0.25-46} source={{uri: appVars.apiUrl +"/"+item.picture.img.src} } >
            {(item.paywall)?<View><View style={appStyles.paywallIconTriangle} /><AwseomeIcon style={appStyles.paywallIcon} name="plus" /></View>:<View></View>}
            {(this.state.downloading && (this.state.currentItem==item.id))?<ActivityIndicator style={appStyles.ePaperActivityIndicator} size="large" color={appVars.colorMain}/>:<View></View>}
            </Image>
           <Text style={appStyles.ePaperEditionDate}>{item["date"]}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  renderItemNewst = (item) =>{
    return(
      <View style={appStyles.ePaperMainWrapper}>
        <TouchableOpacity style={appStyles.imageBorder} activeOpacity = { .5 } onPress={ this.handleClick.bind(this,item)}>
          <Image maxHeight={Dimensions.get('window').height*0.75-115} source={{uri: appVars.apiUrl +"/"+item.singleSRC} } >
          {(item.paywall)?<View><View style={appStyles.paywallIconTriangle} /><AwseomeIcon style={appStyles.paywallIcon} name="plus" /></View>:<View></View>}
          {(this.state.downloading && (this.state.currentItem==item.id))?<ActivityIndicator style={appStyles.ePaperActivityIndicator} size="large" color={appVars.colorMain}/>:<View></View>}
          </Image>
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
