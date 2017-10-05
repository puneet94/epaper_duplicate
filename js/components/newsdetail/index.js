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
    Button,

} from 'react-native';
import HTMLView from 'react-native-htmlview';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import { NavigationActions } from 'react-navigation';

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
        <Text>{item.topheadline}</Text>
        <Text style={styles.headline}>{item.headline}</Text>
        <Text>{item.subheadline}</Text>
        <Text>{item.editor}</Text>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{uri: appVars.apiUrl +"/"+item.singleSRC} } />
            <Text>{item.caption}</Text>
          </View>
            <Text style={styles.teaser}>{item.teaser}</Text>
            <View><Text style={styles.city}>{item.city}</Text></View>
            <HTMLView addLineBreaks={false} value={item.text} stylesheet={htmlstyles} onLinkPress={(url) => alert('clicked link:'+url)} />
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
const htmlstyles =StyleSheet.create({
  p: {
    fontSize: swidth/24.610,
    fontFamily: appVars.fontText,
    color: appVars.colorBlack,
    lineHeight: swidth/20,
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
    width: swidth-8,
    height: null,
  },

  image:{
    width: (swidth*0.25),
    height: (swidth*0.25),
    margin: 3,
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
