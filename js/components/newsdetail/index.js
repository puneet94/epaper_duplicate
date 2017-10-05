"use strict"
import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import appStyles from '../../appStyles';
import appVars from '../../appVars';

import store from 'react-native-simple-store';

class NewsDetailScreen extends Component{

  static navigationOptions = ({navigation})=>{

    return {
      headerRight: <AwseomeIcon name="share-alt" />
      //headerMode: 'none'
    };
  };

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
      refreshing: false,
    }
  }

  componentDidMount(){
    this.fetchdata();
  }


fetchdata = async () => {
  const navParams = this.props.navigation.state.params;
  const { page } = this.state;
  const api = appVars.apiUrl+"/news/newsreader.html?authtoken="+appVars.apiKey+"&id="+navParams.newsid;
  let tempapi= api;
  this.setState({ loading: true});

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
};

  handleRefresh = () =>{
    this.setState({
      refreshing:true,
    }, ()=>{
      this.fetchdata();
    })
  }

  renderItem = (item) =>{

    return(

      <View style={styles.news}>
        <Text>{item.date}</Text>
        <Text>{item.subheadline}</Text>
        <Text style={styles.headline}>{item.headline}</Text>
        <Text>{item.subheadline}</Text>
        <Text>{item.editor}</Text>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{uri: appVars.apiUrl +"/"+item.singleSRC} } />
            <Text>{item.caption}</Text>
          </View>
            <Text style={styles.teaser}>{item.teaser}</Text>
            <View><Text style={styles.city}>{item.city} {item.text}</Text></View>

      </View>

    );
  }

	render()
	{
    return (
      <View style={appStyles.container}>
      <FlatList
        data={this.state.data}
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
        renderItem={({item}) => this.renderItem(item)}
       />
      </View>
    );
	}
}

export default NewsDetailScreen;

var swidth = Dimensions.get('window').width;

// width of standard ~5" screen mobile device is like 320
// just testing responsive fontsizes to ScreenWidth.

const styles = StyleSheet.create({

  test: {
    position: 'absolute',
    top: 0,
    right: 0,
   zIndex: 100,
  elevation: 100,
  },

  imageContainer: {
    borderColor: '#cccccc',
    borderWidth: 1,
    width: swidth-8,
    height: null,
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

});
