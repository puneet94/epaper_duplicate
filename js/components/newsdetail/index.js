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
import htmlStyles from '../../htmlStyles';
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
         headerRight: <Button title="SHARE" onPress={() => params.handleAlert()} />
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

        <View style={appStyles.topheadlineContainer}><Text style={appStyles.topheadline}>{item.topheadline.toUpperCase()}</Text></View>

        <Text style={appStyles.headline}>{item.headline}</Text>

        <Text style={appStyles.subheadline}>{item.subheadline}</Text>

          <View style={styles.imageContainer}>
            <Image width={Dimensions.get('window').width-18} source={{uri: appVars.apiUrl +"/"+item.singleSRC} } />
            <Text style={appStyles.imagecopyright}>{item.imagecopyright}</Text>
          </View>

          <Text style={appStyles.imagecaption}>{item.caption}</Text>

          <HTMLView addLineBreaks={false} stylesheet={htmlStyles.teaser} value={item.teaser} />


          <View><Text>{item.date}</Text><Text>{item.editor}</Text></View>

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


});
