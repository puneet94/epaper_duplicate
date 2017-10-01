"use strict"
import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    FlatList,
    StyleSheet,
    Image,
    Platform,
    TouchableWithoutFeedback,
    TouchableOpacity,
    PermissionsAndroid,
    Dimensions,
    RefreshControl,
    Alert,
    ActivityIndicator
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import appStyles from '../../appStyles';
import appVars from '../../appVars';
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

  componentDidMount(){

    if(Platform.OS === 'android') {
      this.getPermissions();
    }

    this.fetchdata();
  }

fetchdata = async () => {
  const { page } = this.state;
  const api = appVars.apiUrl+"/epaper.html?authtoken="+appVars.apiKey+"&limit="+appVars.apiLimit+"&pid="+appVars.apiArchives;
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

    console.log("existing issues");
    console.log(myissues);
    console.log(item);
    const { navigation } = this.props;
    myissues = myissues||[];
    for(let i=0;i<myissues.length;i++){
      if(myissues[i].id==item.id){
         downloadFile = false;

        navigation.navigate('PDFView', {file: myissues[i].path});
        break;
      }
    }
    //console.log(url);

    if(downloadFile){
      this.setState({
        downloading: true
      });
      console.log("download started******************");

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
      navigation.navigate('PDFView', {file: resp.path()});

      const issueObject = {
        path: resp.path(),
        thumbNail: imageResp.path(),
        date: item.date,
        id: item.id
      };
      console.log("issue saved");
      console.log(issueObject);
      store.push('userIssues',issueObject );
    }
  }
  //console.log(url);

  if(downloadFile){
    this.setState({
      downloading: true
    });
    console.log("download started******************");

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
    navigation.navigate('PDFView', {file: resp.path()});

    const issueObject = {
      path: resp.path(),
      thumbNail: imageResp.path(),
      date: item.date,
      id: item.id
    };
    console.log("issue saved");
    console.log(issueObject);
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

  renderSeparator = () =>{
    return(
      <View
      style={{
        backgroundColor: 'gray',
        height: 5,
      }}
    />
    );
  }

  handleClick = (item)=>{
    this.setState({
      currentItem: item.id
    });
    this.downloadFile('https://mopo-server.de/'+ item["downloadPath"], item);
  }

  renderItem = (item) =>{
    //console.log(appVars.apiUrl +"/"+item.singleSRC);
    return(
      <View style={styles.issue}>
        <TouchableOpacity activeOpacity = { .5 } onPress={ this.handleClick.bind(this,item)}>
          <Image style={styles.image} source={{uri: appVars.apiUrl +"/"+item.singleSRC} } >
            {(item.paywall)?<AwseomeIcon name="plus" style={styles.paywallicon}/>:<View></View>}
            {(this.state.downloading && (this.state.currentItem==item.id))?<ActivityIndicator style={appStyles.test} size="large" color="green"/>:<View></View>}
          </Image>
        </TouchableOpacity>
        <Text style={styles.details}>{item["date"]}</Text>
      </View>

    );
  }

	render()
	{
    //console.log("rendering");
    return (
      <View style={appStyles.container}>

      <FlatList
        data={this.state.data}
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            colors={[appVars.colorMain]}
          />
          }
        ItemSeparatorComponent={this.renderSeparator}
        onEndReached={this.handlePageEnd}
        onEndReachedThreshold={0.5}
        keyExtractor={(item,index)=> {
          //console.log(item.id);
          return item.id;
          }}
        renderItem={({item}) => this.renderItem(item)}
       />
      </View>
    );
	}
}

export default HomeScreen;

var swidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  demo:{
    color: 'black',
  },
  image:{
    width: (swidth * .5)-8,
    height: 300,
    marginLeft: 5,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: appVars.colorMain,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  paywallicon:{
    color: appVars.colorWhite,
    backgroundColor: appVars.colorMain,
    padding: 20,
  },
  issue:{
    marginTop: 20,
    marginBottom: 10,
  },
  details:{
    fontWeight: 'bold',
  }
});
