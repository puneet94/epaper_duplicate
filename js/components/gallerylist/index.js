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
    Linking,
    Button,
    Image
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import appStyles from '../../appStyles';
import appVars from '../../appVars';

import store from 'react-native-simple-store';
class GalleryListScreen extends Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: [],
      page: 1,
      error: null,
      refreshing: false,
      downloading: false,
      currentItem: null,
      bannerAds: [],
      bannerAdsUrl: [],
      bannerAdsWidth: [],
      bannerAdsHeight: [],
    }
  }
  componentWillMount = async ()=>{
    let bannerAds = await this.fetchBannerAds();
    bannerAds = await bannerAds.json();
    
    this.setState({
      bannerAds: bannerAds.response.map((singlesource)=>{
        return appVars.apiUrl +"/"+singlesource.singleSRC;
      }),
      bannerAdsUrl: bannerAds.response.map((singlesource)=>{
        return singlesource.url;
      }),
      bannerAdsWidth: bannerAds.response.map((singlesource)=>{
        return singlesource.width;
      }),
      bannerAdsHeight: bannerAds.response.map((singlesource)=>{
        return singlesource.height;
      })

    });
  }
  componentDidMount  = async () => {
    this.fetchdata();
    
  }

  fetchdata = async () => {
    const { page } = this.state;
    var archive= appVars.GalleryArchives;
    const api = appVars.apiUrl+"/news.html?authtoken="+appVars.apiKey+"&limit="+appVars.apiNewsLimit+"&archives="+archive;
    let tempapi= api+"&page_n58=" + this.state.page.toString();
    
    this.setState({ loading: true});
    if(page===1){
      this.setState({ refreshing: true});
      
      fetch(tempapi)
        .then(res => res.json())
        .then(res => {
          this.setState({
            data: res.response || [],
            error: res.error || null,
            loading : false,
            refreshing: false,
            
          });
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

  handleRefresh = () =>{
    this.setState({
      page: 1,
      refreshing:true
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

  handleExternalUrl = function (externalurl){
    Linking.canOpenURL(externalurl).then(supported => {
          if (supported) {
            Linking.openURL(externalurl);
          } else {
            console.log("Don't know how to open URI: " + externalurl);
          }
      });
  }

  fetchBannerAds = ()=>{
    const apiAd = appVars.apiUrl+"/ads.html?authtoken="+appVars.apiKey+"&pid="+appVars.apiAdArchives;
    return fetch(apiAd);
    //.then(res => res.json());
  }
  
  ratioImageHeigh = (width,height,multiplicate) =>{
    return height*(appVars.screenX*multiplicate/width);
  }

  renderAdSeparator =  (index) => {
    const arrayIndex = (index)%(this.state.bannerAds.length);
        return(
          <View style={appStyles.listAd}>
            <TouchableOpacity activeOpacity = { .5 } onPress={()=> this.handleExternalUrl(this.state.bannerAdsUrl[arrayIndex])}>
            <Image
              maxWidth={Dimensions.get('window').width} 
              source={{uri: this.state.bannerAds[arrayIndex] }}
              style={{width: ((appVars.screenX)), height: this.ratioImageHeigh(this.state.bannerAdsWidth[arrayIndex],this.state.bannerAdsHeight[arrayIndex],1)}}
              />
              </TouchableOpacity>
          </View>
        );
  };

  renderSeparator = () =>{
    
    return(
      <View style={appStyles.contentSeperator}/>
    );
  }

  handleClick = async (item)=>{

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

    const { navigation } = this.props;
    navigation.navigate('NewsDetail', {newsid: item.id});
  }

  checkActiveMenu = (menu)=>{
    if(this.state.selectedArchive===menu){
      return true;
    }
  }


  renderItem = (item,index) =>{
    
    return(
      <View>
      <View style={appStyles.contentElement}>
      
          <TouchableOpacity activeOpacity = { .5 } onPress={ this.handleClick.bind(this,item)}>
          
          {(item.paywall)?<View><View style={appStyles.paywallIconTriangle} /><AwseomeIcon style={appStyles.paywallIcon} name="plus" /></View>:<View></View>}
          
          <Text style={appStyles.newsListHeadline}  numberOfLines={1}>{item.headline}</Text>
            
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View>
              <View style={appStyles.imageBorder}>
              <Image style={{width: appVars.screenX*0.25, height: appVars.screenX*0.25}} source={{uri: appVars.apiUrl +"/"+item.picture.img.src} } />
              </View>
            </View>
            <View style={appStyles.newsListInner}>
              <Text style={appStyles.newsDate}>{item["date"]}</Text>

              <Text style={appStyles.newsListTeaser}  numberOfLines={5}><Text style={appStyles.newsListCity}>{item.city.toUpperCase()}.</Text>{item.text.replace(/<{1}[^<>]{1,}>{1}/g," ")}</Text>
            </View>
          </View>
          </TouchableOpacity>
        </View>      
        {((index+1)%3==0)?this.renderAdSeparator(index):this.renderSeparator()}
      </View>

    );
  }

	render()
	{
    return (
      
      <View style={appStyles.container}>

      <View style={appStyles.newsListContainer}>
      <FlatList
        data={this.state.data}
        numColumns={1}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            colors={[appVars.colorMain]}
          />
          }
        onEndReached={this.handlePageEnd}
        onEndReachedThreshold={.5}
        keyExtractor={(item,index)=> {
          return item.id;
          }}
        renderItem={({item,index}) => this.renderItem(item,index)}
       />
       </View>
      </View>
    );
	}
}

export default GalleryListScreen;