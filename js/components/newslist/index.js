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
    ActivityIndicator,
    ToastAndroid
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import appStyles from '../../appStyles';
import appVars from '../../appVars';

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
      currentItem: null
    }
  }

  componentDidMount(){
    this.fetchdata();
  }

fetchdata = async () => {
  const { page } = this.state;
  const api = appVars.apiUrl+"/news.html?authtoken="+appVars.apiKey+"&limit="+appVars.apiNewsLimit+"&pid="+appVars.apiNewsArchives;
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

  renderItem = (item) =>{

    return(

      <View style={styles.newslist}>
        <TouchableOpacity activeOpacity = { .5 } onPress={ this.handleClick.bind(this,item)}>
        {(item.paywall)?<View><View style={styles.paywallIconTriangle} /><AwseomeIcon style={styles.paywallIcon} name="plus" /></View>:<View></View>}
        <Text style={styles.headline}>{item.headline}</Text>
          <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{uri: appVars.apiUrl +"/"+item.picture.img.src} } />
          </View>
          <View style={styles.newslistInner}>
            <Text style={styles.details}>{item["date"]}</Text>

            <Text style={styles.teaser}><Text style={styles.city}>{item.city}</Text>{item.text}</Text>
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

var swidth = Dimensions.get('window').width;

// width of standard ~5" screen mobile device is like 320
// just testing responsive fontsizes to ScreenWidth.

const styles = StyleSheet.create({

  imageContainer: {
    borderColor: '#cccccc',
    borderWidth: 1,
    width: (swidth*0.25)+8,
    height: (swidth*0.25)+8,
    marginRight: 10,
  },

  image:{
    width: (swidth*0.25),
    height: (swidth*0.25),
    margin: 3,
  },

  newslist: {
    margin: 5,
  },

  newslistInner: {
    width: (swidth*0.75)-28,
  },

  headline: {
    //fontsize:20,
    fontSize: swidth/16,
    fontFamily: appVars.fontHeadline,
    color: appVars.colorBlack,
    paddingBottom: 5,
  },

  teaser: {
    //fontSize: 13,
    fontSize: swidth/24.610,
    fontFamily: appVars.fontText,
    color: appVars.colorBlack,
    lineHeight: swidth/20,
  },

  paywallIconTriangle:{
    position: 'absolute',
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 32,
    borderTopWidth: 32,
    borderRightColor: 'transparent',
    borderTopColor: appVars.colorMain,
    transform: [
      {rotate: '90deg'}
    ]
  },

  paywallIcon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 2,
    top: 2,
    fontSize: 16,
    color: appVars.colorWhite,
  },

});
