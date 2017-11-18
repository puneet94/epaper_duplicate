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
    Share,
    Modal,
    ListView,
    Image,
    Alert
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import { NavigationActions } from 'react-navigation';
import YouTube from 'react-native-youtube';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import store from 'react-native-simple-store';
import { em_s, lineHeight_s, handleExternalUrl } from '../../core/helpers';


class NewsDetailScreen extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data: [],
      gallerydata: [],
      gallerypage: 1,
      error: null,
      refreshing: false,
      audioPaused: true,
      YoutubePlayerHeight: ((appVars.screenX/16)*9)-1,
      fontSize: appVars.baseUnit
  }
}
componentWillMount = async ()=>{
  store.delete('deepLinkNewsId');
  
  let fontSize = Number.parseInt(await store.get('fontSize'),10);

  if(fontSize){
    this.setState({
      fontSize
    });
  }
}
  SocialShare =()=>{
    Share.share({
      message: this.state.shareUrl,
      url: this.state.shareUrl,
      title: this.state.shareTitle
    }, {
      // Android only:
      dialogTitle: this.state.shareTitle,
    })
  }

  playReadspeaker = async () => {
    const ReadspeakerUrl = appVars.ReadspeakerUrl+this.state.shareUrl;
    this.setState({
      audioPaused: false
    });
    ReactNativeAudioStreaming.play(ReadspeakerUrl, {showIniOSMediaCenter: true, showInAndroidNotifications: false});
    
  }

  stopReadspeaker =()=>{
    this.setState({
      audioPaused: true
    });
    ReactNativeAudioStreaming.stop();
  }
  
  static navigationOptions = ({ navigation }) => {
     const { params = {} } = navigation.state;  
    if(params.media) {
     return {
         headerRight: <View style={{flexDirection:"row"}}>
           <TouchableOpacity style={appStyles.iconWrapper} onPress={() => params.handleSocialShare()}><IoniconsIcon size={24} name={appVars.shareIcon} color={appVars.colorBlack}/></TouchableOpacity>
           </View>
     }
    } else {
      return {
      headerRight: <View style={{flexDirection:"row"}}>
            {params.audioPaused?<TouchableOpacity style={appStyles.iconWrapper} onPress={() => params.handleReadspeakerPlay()}><AwseomeIcon size={24} name="assistive-listening-systems" color={appVars.colorBlack}/></TouchableOpacity>:<TouchableOpacity style={appStyles.iconWrapper} onPress={() => params.handleReadspeakerStop()}><AwseomeIcon size={24} name="stop-circle" color={appVars.colorBlack}/></TouchableOpacity>}
            <TouchableOpacity style={appStyles.iconWrapper} onPress={() => params.handleSocialShare()}><IoniconsIcon size={24} name={appVars.shareIcon} color={appVars.colorBlack}/></TouchableOpacity>
            </View>
      }
    }
 };

  componentDidMount = async ()=>{
   
    this.props.navigation.setParams({ 
      handleSocialShare: this.SocialShare,
      handleReadspeakerPlay: this.playReadspeaker,
      handleReadspeakerStop: this.stopReadspeaker,
      audioPaused: this.state.audioPaused
    });    
     this.fetchdata(); 
  }
  componentWillUpdate = async (nextProps,nextState)=>{
    let fontSize = Number.parseInt(await store.get('fontSize'),10);
    if(fontSize && fontSize!==nextState.fontSize){
      this.setState({
        fontSize
      });
    }
  }
componentDidUpdate = (prevProps,prevState)=>{
  if(prevState.audioPaused!==this.state.audioPaused){
    this.props.navigation.setParams({ 
      handleSocialShare: this.SocialShare,
      handleReadspeakerPlay: this.playReadspeaker,
      handleReadspeakerStop: this.stopReadspeaker,
      audioPaused: this.state.audioPaused
    });    
    }
}

componentWillUnmount=()=>{
  this.setState({
    audioPaused: true
  });
  ReactNativeAudioStreaming.stop();
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
          shareUrl: res.response[0].shareurl,
          shareTitle: res.response[0].headline,
          YouTubeId: res.response[0].youtube_id, 
        },()=>{
        });
      })
      .then(
        this.fetchgallerydata()
      )
      .catch(error => {
        this.setState({ error, loading: false });
      })
};
fetchgallerydata = async () => {
  const navParams = this.props.navigation.state.params; 
  const { gallerypage } = this.state;
  const api = appVars.apiUrl+"/gallery.html?authtoken="+appVars.apiKey+"&id="+navParams.newsid;
  let tempapi= api+"&limit=8&page_n122=" + this.state.gallerypage.toString();  
  this.setState({ loading: true});

      fetch(tempapi)
        .then(res => res.json())
        .then(res => {
          
          this.setState({
            gallerydata: [...this.state.gallerydata, ...res.response],
            error: res.error || null,
            loading : false,
            refreshing: false
          })
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });

};

  handleRefresh = () =>{
    this.setState({
      refreshing:true,
    }, ()=>{
      this.fetchdata();
    })
  }

  handlePageEnd = ()=>{
    this.setState({
      gallerypage: this.state.gallerypage+1,
    }, ()=>{
      this.fetchgallerydata();
    });
  }

  openImageViewer = async (item)=>{
        const { navigation } = this.props;
        navigation.navigate('ImageViewer', {item: item});
  }

  openGalleryViewer = async (item,index)=>{
    const navParams = this.props.navigation.state.params;     
    const { navigation } = this.props;
    navigation.navigate('ImageViewer', {item: item, newsid: navParams.newsid,initialPage:index,images:this.state.gallerydata});
  }

  renderGalleryItem  = (item,index) =>{
   
    return(
      <TouchableOpacity style={appStyles.galleryItem} key={index} activeOpacity={0.5} onPress={()=>this.openGalleryViewer(item,index)}>
        <View style={appStyles.imageBorder}>
          <Image style={{backgroundColor: appVars.colorSeperatorColor, resizeMode: 'contain', width: (appVars.screenX*0.25)-15, height: (appVars.screenX*0.25)-15}} source={{uri: appVars.apiUrl +"/"+item.img.src} } />
        </View>
      </TouchableOpacity>
    )
  }

  ratioImageHeigh = (width,height,multiplicate) =>{
    return height*(appVars.screenX*multiplicate/width);
  }

  handleYoutubeReady = () => {
    setTimeout(() => this.setState({ YoutubePlayerHeight: (appVars.screenX/16)*9 }), 200);
}


 renderItem = (item) =>{

    return(

      <View style={appStyles.contentElement}>

      {(item.topheadline)?<View style={appStyles.topheadlineContainer}><Text style={[appStyles.topheadline,{fontSize:em_s(.75,this.state.fontSize)}]}>{item.topheadline.toUpperCase()}</Text></View>:<View></View>}
        <Text style={[appStyles.headline,{fontSize:em_s(2.250,this.state.fontSize)}]}>{item.headline}</Text>

        <Text style={[appStyles.subheadline,{fontSize:em_s(1,this.state.fontSize), marginBottom: em_s(0.500,this.state.fontSize)}]}>{item.subheadline}</Text>
        {(item.youtube_id)?<View>
          <YouTube
          videoId={item.youtube_id}   // The YouTube video ID
          play={true}             // control playback of video with true/false
          fullscreen={false}       // control whether the video should play in fullscreen or inline
          loop={false}             // control whether the video should loop when ended
          apiKey={appVars.YoutubeAPIKey}
          controls={1}
          onReady= {this.handleYoutubeReady}
          style= {{ alignSelf: 'stretch', height: this.state.YoutubePlayerHeight, marginBottom: 10, }}
          />
          </View>:
        <TouchableOpacity style={appStyles.imageContainer} activeOpacity={0.5} onPress={this.openImageViewer.bind(this,item)}>
                <View style={appStyles.imageBorder}>
                  <Image 
                  style={{backgroundColor: appVars.colorSeperatorColor, width: ((appVars.screenX)-28), height: this.ratioImageHeigh(item.width,item.height,1)-28}}
                  source={{uri: appVars.apiUrl +"/"+item.singleSRC} }
                  />
                  {(item.imagecopyright)?<Text style={[appStyles.imagecopyright,{fontSize:em_s(0.750,this.state.fontSize)}]}>Foto: {item.imagecopyright}</Text>:<View></View>}
                </View>
                {(item.caption)?<Text style={[appStyles.imagecaption,{fontSize:em_s(0.875,this.state.fontSize),marginBottom: em_s(0.500,this.state.fontSize)}]}>{item.caption}</Text>:<View></View>}
        </TouchableOpacity>
        }

          {(item.teaser)?<HTMLView addLineBreaks={false} stylesheet={
          StyleSheet.create({
            p: {
              fontSize: em_s(0.875,this.state.fontSize),
              lineHeight: lineHeight_s(0.875,this.state.fontSize,150),
              fontFamily: appVars.fontSub,
              color: appVars.colorBlack,
              marginBottom: em_s(0.875,this.state.fontSize),
            },
            strong: {
              fontWeight: '700'
            },
            a: {
              color: appVars.colorMain,
              fontWeight: '700',
            },
            h3: {
              fontSize: em_s(1.250,this.state.fontSize),
              lineHeight: lineHeight_s(1.250,this.state.fontSize,120),
              fontFamily: appVars.fontHeadline,
              color: appVars.colorBlack,
              marginBottom: em_s(0.500,this.state.fontSize),
            }
          })
          }
          value={item.teaser} onLinkPress={(url) => handleExternalUrl(url)} />:<View></View>}

          <HTMLView addLineBreaks={false} value={item.text.replace('<p>', '<p><city>'+item.city.toUpperCase()+'. </city>')} 
          
          stylesheet={StyleSheet.create({
            p: {
              fontSize: em_s(0.875,this.state.fontSize),
              lineHeight: lineHeight_s(0.875,this.state.fontSize,150),
              fontFamily: appVars.fontText,
              color: appVars.colorBlack,
              marginBottom: em_s(0.875,this.state.fontSize),
              paddingLeft: 20,
              paddingRight: 20,
            },
            strong: {
              fontWeight: '700'
            },
            a: {
              color: appVars.colorMain,
              fontWeight: '700',
            },
            city: {
                fontSize: em_s(0.875, this.state.fontSize),
                fontFamily: appVars.fontMain,
                color: '#333',
            },
            h3: {
              fontSize: em_s(1.250,this.state.fontSize),
              lineHeight: lineHeight_s(1.250,this.state.fontSize,120),
              fontFamily: appVars.fontHeadline,
              color: appVars.colorBlack,
              marginBottom: em_s(0.500,this.state.fontSize),
            }
          })  
          }
          
          onLinkPress={(url) => handleExternalUrl(url)} />
          
            <FlatList
            data={this.state.gallerydata}
            numColumns={4}
            keyExtractor={(item,index)=> {
                return item.img.src;
              }}
            renderItem={({item,index}) => this.renderGalleryItem(item,index)}
            />
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between'}}>
            <Text style={appStyles.newsDate}>{item.date}</Text>
            <Text style={appStyles.newsEditor}>{item.editor}</Text>
          </View>
          
      </View>

    );
  }

	render = ()=>{


    return (
      <View style={appStyles.contenContainer}>
      <FlatList
        data={this.state.data}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            colors={[appVars.colorMain]}
          />
          }
        onEndReachedThreshold={.5}
        onEndReached={this.handlePageEnd}
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