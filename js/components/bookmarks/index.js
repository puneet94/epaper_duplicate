
import React, { Component } from 'react'
import {
  ToastAndroid,
  Platform,
  Text,
  Button,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import store from 'react-native-simple-store';
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import { NavigationActions } from 'react-navigation';


class BookmarksScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      bookmarks: [],
      bookmarksHash: {}
    }
  }

  componentWillMount = async ()=>{
    const bookmarksHash = await store.get('bookmarks') || {};
    const bookmarks = Object.keys(bookmarksHash);
    this.setState({
        bookmarksHash,
        bookmarks
    });
  }
  ratioImageHeigh = (width,height,multiplicate) =>{
    return height*(appVars.screenX*multiplicate/width);
  }
  openNews = (newsid)=>{   
    const { navigation } = this.props;
    navigation.navigate('NewsDetail', {newsid});
  }
  renderIssue = (newsid)=>{
      const item = this.state.bookmarksHash[newsid];
    return (
    <View style={{flex:1,margin:3}}>
      <TouchableOpacity style={appStyles.imageBorder} activeOpacity = { .5 } onPress={ ()=>{
        this.openNews(newsid)
        }}>
        <Image 
            style={{ height: 200}}
            source={{uri:appVars.apiUrl+"/"+item.bookmarkImage}}
        />
        <Text style={appStyles.ePaperEditionDate}>{item.bookmarkHeadline}</Text>
      </TouchableOpacity>
    </View>
    );
  }
  renderIssues = ()=>{
    return (
      <FlatList
      data={this.state.bookmarks}
      numColumns={2}
      keyExtractor={item=> item}
      renderItem={({item}) => this.renderIssue(item)}
     />
    );
  }
  render=()=> {

    const { navigation } = this.props
    return (
      <View style={appStyles.container}>
            
        
          {
            this.state.bookmarks && this.renderIssues()
          }
      </View>
    );
  }
}
export default BookmarksScreen;