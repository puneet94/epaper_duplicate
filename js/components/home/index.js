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
    Alert
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import appStyle from '../../appStyles';
import appVars from '../../appVars';
import RNFetchBlob from 'react-native-fetch-blob';

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


  downloadFile = (url,id)=>{
    //console.log(url);
    RNFetchBlob
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
            path: RNFetchBlob.fs.dirs.DownloadDir+"/"+id,
            mediaScannable : true,
        }
    })
    .fetch('GET', url)
    .then((resp) => {
      const { navigation } = this.props;

      // if you wanna open the pdfview screen
      navigation.navigate('PDFView', {file: resp.path()});

      // the path of downloaded file
      //Alert.alert(resp.path());
    })
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
    this.downloadFile('https://mopo-server.de/'+ item["downloadPath"], item["id"]);
  }

  renderItem = (item) =>{
    //console.log(appVars.apiUrl +"/"+item.singleSRC);
    return(

      <View style={styles.issue}>
        <TouchableOpacity activeOpacity = { .5 } onPress={ this.handleClick.bind(this,item)}>
        <Image style={styles.image} source={{uri: appVars.apiUrl +"/"+item.singleSRC} } />
        </TouchableOpacity>
        <Text style={styles.details}>{item["date"]}</Text>
      </View>

    );
  }

	render()
	{
    //console.log("rendering");
    return (
      <View style={appStyle.container}>

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
  },
  issue:{
    marginTop: 20,
    marginBottom: 10,
  },
  details:{
    fontWeight: 'bold',
  }
})
