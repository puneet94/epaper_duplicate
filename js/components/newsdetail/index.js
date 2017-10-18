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
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import { YouTubeStandaloneAndroid } from 'react-native-youtube';
import { YouTubeStandaloneIOS } from 'react-native-youtube';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import appStyles from '../../appStyles';
import htmlStyles from '../../htmlStyles';
import appVars from '../../appVars';
import { NavigationActions } from 'react-navigation';
import Gallery from 'react-native-image-gallery';
import store from 'react-native-simple-store';


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
      shown: false,
  }
}

  YouTube =()=>{
    if(Platform.OS === 'android') {    
    YouTubeStandaloneAndroid.playVideo({
      apiKey: appVars.YoutubeAPIKey,     // Your YouTube Developer API Key
      videoId: this.state.YouTubeId,     // YouTube video ID
      autoplay: true,             // Autoplay the video
      startTime: 0,             // Starting point of video (in seconds)
    })
      .then(() => console.log('Standalone Player Exited'))
      .catch(errorMessage => console.error(errorMessage))
    } else {
      YouTubeStandaloneIOS.playVideo(this.state.YouTubeId)
      .then(() => console.log('Standalone Player Exited'))
      .catch(errorMessage => console.error(errorMessage))
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
  
  static navigationOptions = ({ navigation }) => {
     const { params = {} } = navigation.state;
     return {
         headerRight: <View style={{flexDirection:"row"}}>
           {params.showYoutube && <TouchableOpacity style={appStyles.iconWrapper} onPress={() => params.handleYouTube()}><IoniconsIcon size={24} name="logo-youtube"  color="black"/></TouchableOpacity>}
           <TouchableOpacity style={appStyles.iconWrapper} onPress={() => params.handleSocialShare()}><IoniconsIcon size={24} name={appVars.shareIcon}  color="black"/></TouchableOpacity>
           </View>
     };
 };

  componentDidMount(){
    
    this.props.navigation.setParams({ 
      handleYouTube: this.YouTube,
      handleSocialShare: this.SocialShare 
    });
    
    this.fetchdata();
  }
  
    
componentDidUpdate = (prevProps,prevState)=>{
  if(this.state.YouTubeId && !prevState.YouTubeId){
  
    this.props.navigation.setParams({ 
      showYoutube: true,
      handleYouTube: this.YouTube,
      handleSocialShare: this.SocialShare 
    });
  }
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
        })
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
    console.log("hit image viewer");
    console.log(navParams.newsid);
    console.log(item);
    navigation.navigate('ImageViewer', {item: item, newsid: navParams.newsid,initialPage:index,images:this.state.gallerydata});
}

 renderGalleryItem  = (item,index) =>{
   
    return(
      <TouchableOpacity style={appStyles.galleryItem} key={index} activeOpacity={0.5} onPress={()=>this.openGalleryViewer(item,index)}>
        <View style={appStyles.imageBorder}>
          <Image style={{resizeMode: 'contain', width: (appVars.screenX*0.23)-8, height: (appVars.screenX*0.23)-8}} source={{uri: appVars.apiUrl +"/"+item.img.src} } />
        </View>
      </TouchableOpacity>
    )
  }

  ratioImageHeigh = (width,height,multiplicate) =>{
    return height*(appVars.screenX*multiplicate/width);
  }

 renderItem = (item) =>{

    return(

      <View style={appStyles.contentElement}>

      {(item.topheadline)?<View style={appStyles.topheadlineContainer}><Text style={appStyles.topheadline}>{item.topheadline.toUpperCase()}</Text></View>:<View></View>}

        <Text style={appStyles.headline}>{item.headline}</Text>

        <Text style={appStyles.subheadline}>{item.subheadline}</Text>
        <TouchableOpacity activeOpacity={0.5} onPress={this.openImageViewer.bind(this,item)}>
                <View style={appStyles.imageBorder}>
                  <Image 
                  style={{width: ((appVars.screenX)-28), height: this.ratioImageHeigh(item.width,item.height,1)-28}}
                  source={{uri: appVars.apiUrl +"/"+item.singleSRC} }
                  />
                  {(item.imagecopyright)?<Text style={appStyles.imagecopyright}>Foto: {item.imagecopyright}</Text>:<View></View>}
                </View>
        </TouchableOpacity>

          {(item.caption)?<Text style={appStyles.imagecaption}>{item.caption}</Text>:<View></View>}

          {(item.teaser)?<HTMLView addLineBreaks={false} stylesheet={htmlStyles.teaser} value={item.teaser} />:<View></View>}

          <HTMLView addLineBreaks={false} value={item.text.replace('<p>', '<p><city>'+item.city.toUpperCase()+'. </city>')} stylesheet={htmlStyles.text} onLinkPress={(url) => alert('clicked link:'+url)} />
          
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