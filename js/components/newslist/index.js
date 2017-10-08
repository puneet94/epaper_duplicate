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
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import Image from 'react-native-scalable-image';

import store from 'react-native-simple-store';

class NewsListScreen extends Component{

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
    }
  }

  componentDidMount(){
    this.fetchdata();
  }

  fetchdata = async () => {
    const { page } = this.state;
    const navParams = this.props.navigation.state.params;
    if(!navParams) {
      var archive=appVars.NewsArchivesFallback;
    } else {
      var archive=navParams.archive;
    }
    const api = appVars.apiUrl+"/news.html?authtoken="+appVars.apiKey+"&limit="+appVars.apiNewsLimit+"&archives="+archive;
    let tempapi= api+"&page_n58=" + this.state.page.toString();
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

  renderAdSeparator = async () => {
  
    const apiAd = appVars.apiUrl+"/ads.html?authtoken="+appVars.apiKey+"&pid=9,10";

      fetch(apiAd)
        .then(res => res.json())
        .then(res => {
          console.log(res.response[0].singleSRC)
          return(
            <View><Image maxHeight={Dimensions.get('window').width*0.25} source={{uri: appVars.apiUrl +"/"+res.response[0].singleSRC} } /></View>
          );
        })
        .catch(error => {
          this.renderSeparator();
        })
  };

  renderSeparator = () =>{
    return(
      <View
      style={{
        backgroundColor: appVars.colorSeperatorColor,
        height: 5,
      }}
    />
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

  handleMenuClick = async (item)=>{
    
        const { navigation } = this.props;
        navigation.navigate('NewsList', {archive: item.archive});
      }

  
  renderMenu = (item)=>{
    
        return (     
          <TouchableOpacity style={{margin: 10, backgroundColor: appVars.colorMain}} activeOpacity = { .5 } onPress={ this.handleMenuClick.bind(this,item)}>
          <Text style={{padding: 5, color: appVars.colorWhite}}>{item.label}</Text>
          </TouchableOpacity>
        );
      }

    renderSubmenu= ()=>{
        return (
          <FlatList
          style={{padding: 10, backgroundColor: appVars.colorLightGray}}
          data={appVars.objNewsCategories}
          extraData={this.state}
          renderItem={({item}) => this.renderMenu(item)}
          keyExtractor={(item,index)=> {
          return item.archive;
          }}
          horizontal={true}
         />
        );
      }

  renderItem = (item) =>{

    return(
      <View style={appStyles.newsList}>
        <TouchableOpacity activeOpacity = { .5 } onPress={ this.handleClick.bind(this,item)}>
        
        {(item.paywall)?<View><View style={appStyles.paywallIconTriangle} /><AwseomeIcon style={appStyles.paywallIcon} name="plus" /></View>:<View></View>}
        
        <Text style={appStyles.newsListHeadline}>{item.headline}</Text>
          
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View>
            <View style={appStyles.imageBorder}>
            <Image maxHeight={Dimensions.get('window').width*0.25} source={{uri: appVars.apiUrl +"/"+item.picture.img.src} } />
            </View>
          </View>
          <View style={appStyles.newsListInner}>
            <Text style={appStyles.newsDate}>{item["date"]}</Text>

            <Text style={appStyles.newsListTeaser}><Text style={appStyles.newsListCity}>{item.city.toUpperCase()}.</Text>{item.text.replace(/<{1}[^<>]{1,}>{1}/g," ")}</Text>
          </View>
          
        </View>
      </TouchableOpacity>
      </View>

    );
  }

	render()
	{
    
    return (
      <View style={appStyles.container}>

        <View>
          {
            this.renderSubmenu()
          }
        </View>

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
        ItemSeparatorComponent={this.renderSeparator}
        onEndReached={this.handlePageEnd}
        onEndReachedThreshold={2}
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

export default NewsListScreen;