"use strict"
import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    Button,

} from 'react-native';
import HTMLView from 'react-native-htmlview';
import YouTube from 'react-native-youtube';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import { NavigationActions } from 'react-navigation';
import Image from 'react-native-scalable-image';
import store from 'react-native-simple-store';

class NewsDetailScreen extends Component{

  _showAlert =()=>{
      alert('test');
    }

  static navigationOptions = ({ navigation }) => {
     const { params = {} } = navigation.state;
     return {
         headerRight: <Button title="ALERT" onPress={() => params.handleAlert()} />
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
    this.props.navigation.setParams({ handleAlert: this._showAlert });
    this.fetchdata();
  }


fetchdata = async () => {
  const navParams = this.props.navigation.state.params;
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

        <Text style={styles.topheadline}>{item.topheadline.toUpperCase()}</Text>
        <Text style={styles.headline}>{item.headline}</Text>
        <Text style={styles.subheadline}>{item.subheadline}</Text>

          <View style={styles.imageContainer}>
            <Image width={Dimensions.get('window').width-18} source={{uri: appVars.apiUrl +"/"+item.singleSRC} } />
            <Text>{item.imagecopyright}</Text>
          </View>

          <Text>{item.caption}</Text>

          <HTMLView addLineBreaks={false} value={item.teaser} stylesheet={teaserstyles} />
          <View><Text style={styles.city}>{item.city}</Text></View>
          <HTMLView addLineBreaks={false} value={item.text} stylesheet={textstyles} onLinkPress={(url) => alert('clicked link:'+url)} />
          <View><Text>{item.date}</Text><Text>{item.editor}</Text></View>
          <YouTube
            apiKey="AIzaSyDnHRcAVdm_hLVvZNTIBCucsaKMggJeGaU"
            videoId={item.youtube_id}   // The YouTube video ID
            play={true}             // control playback of video with true/false
            fullscreen={false}       // control whether the video should play in fullscreen or inline
            loop={false}             // control whether the video should loop when ended

            onReady={e => this.setState({ isReady: true })}
            onChangeState={e => this.setState({ status: e.state })}
            onChangeQuality={e => this.setState({ quality: e.quality })}
            onError={e => this.setState({ error: e.error })}

            style={{ alignSelf: 'stretch', height: 300 }}
            />
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


const teaserstyles = StyleSheet.create({
  p: {
    fontSize: swidth/23,
    fontFamily: appVars.fontSub,
    color: appVars.colorBlack,
    lineHeight: swidth/22,
  },

  strong: {
    fontWeight: '700'
  },
  a: {
    color: appVars.colorMain,
    fontWeight: '700'
  },
  h3: {
    fontSize: swidth/16,
    fontFamily: appVars.fontHeadline,
    color: appVars.colorBlack,
  }
});

const textstyles = StyleSheet.create({
  p: {
    fontSize: swidth/23,
    fontFamily: appVars.fontText,
    color: appVars.colorBlack,
    lineHeight: swidth/22,
  },

  strong: {
    fontWeight: '700'
  },

  a: {
    color: appVars.colorMain,
    fontWeight: '700'
  },

  h3: {
    fontSize: swidth/16,
    fontFamily: appVars.fontHeadline,
    color: appVars.colorBlack,
  }
});

const styles = StyleSheet.create({

  imageContainer: {
    borderColor: '#cccccc',
    borderWidth: 1,
    padding: 3,
  },

  news: {
    margin: 5,
  },

  newslistInner: {

  },

  headline: {
    //fontsize:20,
    fontSize: swidth/16,
    fontFamily: appVars.fontHeadline,
    color: appVars.colorBlack,
    textAlign: 'center',
  },

  topheadline: {
    //fontsize:20,
    fontSize: swidth/36,
    fontFamily: appVars.fontMain,
    color: '#666',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
  },

  subheadline: {
    //fontsize:20,
    fontSize: swidth/28,
    fontFamily: appVars.fontSub,
    color: appVars.colorBlack,
    textAlign: 'center',
  },

  teaser: {
    //fontSize: 13,
    fontSize: swidth/24.610,
    fontFamily: appVars.fontText,
    color: appVars.colorBlack,
    lineHeight: swidth/20,
  },

});
