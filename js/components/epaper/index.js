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
    ImageBackground,
    NativeModules,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';

import appStyles from '../../appStyles';
import appVars from '../../appVars';

import TimerMixin from 'react-timer-mixin';
import RNFetchBlob from 'react-native-fetch-blob';
import store from 'react-native-simple-store';

var PSPDFKit = NativeModules.PSPDFKit;

if(Platform.OS === 'ios') {
  PSPDFKit.setLicenseKey(appVars.PDFVIEWER_KEY);
}


const dirs = RNFetchBlob.fs.dirs;

class ePaperScreen extends Component{

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: [],
      page: 1,
      error: null,
      pages: 0,
      refreshing: false,
      downloading: false,
      currentItem: null
    };
    //this.fetchingData = true;
  }
  componentWillMount  = ()=>{    
  }
  componentDidMount=()=>{
    if(Platform.OS === 'android') {
      this.getPermissions();
    }

    this.fetchingData = false;
    this.fetchdata();
    TimerMixin.setInterval (
      () => {
        if(!this.state.downloading && !this.fetchingData){
        this.handleRefresh();  }
      },
      appVars.apiRefreshTime
    );
  }

fetchdata = async () => {
  //Alert.alert("fetch called");
  const { page } = this.state;
  
  const api = appVars.apiUrl+"/epaper.html?authtoken="+appVars.apiKey+"&limit="+appVars.apiEpaperLimit+"&pid="+appVars.apiEpaperArchives;
  let tempapi= api+"&page_n120=" + this.state.page.toString();
  if(this.state.refreshing && !this.fetchingData){
    this.fetchingData = true;
      fetch(tempapi)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.response || [],
          error: res.error || null,
          loading : false,
          refreshing: false,
          pages: res['@pages']
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      }).finally(()=>{
        
        this.fetchingData = false;
        this.setState({ loading: false });
      });
    } else if(!this.fetchingData) {
      this.fetchingData = true;
      
        fetch(tempapi)
        .then(res => res.json())
        .then(res => {
          this.setState({
            data: [...this.state.data, ...res.response],
            error: res.error || null,
            loading : false,
            refreshing: false,
            pages: res['@pages']
          })
        })
        .catch(error => {
          this.setState({ error, loading: false });
        }).finally(()=>{
          
          this.fetchingData = false;
          this.setState({ loading: false });
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
        
         PSPDFKit.present(myissues[i].path, appVars.PDFVIEWER_CONFIGURATION);
        break;
      }
    }
    

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
        path: RNFetchBlob.fs.dirs.MainBundleDir+"/"+appVars.folder+"/"+item.downloadPath,
          addAndroidDownloads : {
              useDownloadManager : true, // <-- this is the only thing required
              // Optional, override notification setting (default to true)
              notification : true,
              title : 'ePaper',
              description : appVars.textDownloadbyManager,              
              mime : 'application/pdf',   
              path: RNFetchBlob.fs.dirs.DCIMDir+"/"+appVars.folder+"/"+item.id,
              mediaScannable : false,
              }
      })
      .fetch('GET', pdfSource);

      const imageSource = appVars.downloadApiUrl +"/"+item.singleSRC;
      let imageResp = await RNFetchBlob
      .config({
        path: RNFetchBlob.fs.dirs.DocumentDir+"/"+appVars.folder+"/"+item.singleSRC,
        fileCache: false,        
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
      
      store.push('userIssues',issueObject );
      PSPDFKit.present(resp.path(), appVars.PDFVIEWER_CONFIGURATION);
    } catch (error) {
      Alert.alert(appVars.textDownloadError);      
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
      loading: true
    }, ()=>{
      this.fetchdata();
    })
  }




  handlePageEnd = ()=>{
    
    if(((this.state.page+1)<=this.state.pages)&&(!this.fetchingData)){
      
      this.setState({
        page: this.state.page+1,
        loading: true
      }, ()=>{
          this.fetchdata();
      });
    }
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
  renderFooter = ()=>{
    if(this.state.page>=this.state.pages){
      return <View></View>
    }else{
      return (
        <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
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
        onEndReachedThreshold={0.1}
        keyExtractor={(item,index)=> { 
          return item.id;
          }}
        renderItem={({item}) => this.renderItem(item)}
        ListFooterComponent={this.renderFooter}
       />

       </View>
      </View>
    );
	}
}

export default ePaperScreen;
