import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableWithoutFeedback,Platform,Linking} from 'react-native'

import appVars from '../../appVars';
import appStyles from '../../appStyles';

import { NavigationActions } from 'react-navigation'

import AwseomeIcon from 'react-native-vector-icons/FontAwesome';

import OneSignal from 'react-native-onesignal'; // Import package from node modules

import store from 'react-native-simple-store';
class DrawerContainer extends React.Component {
  handleURL = (url)=>{
    const route = url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/)[1];
    const routeName = route.split('/')[0];
    const routeName2 = route.split('/')[1];
    console.log(routeName);
    console.log(routeName2);
    console.log(id);
    if(routeName2=="newsfeed"){
      this.naviagatePage(id);
    }
    
  }
  componentWillMount = async ()=> {
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
    let newsid = await store.get('deepLinkNewsId'); 
    store.delete('deepLinkNewsId');
    if(newsid){
      this.naviagatePage(newsid);
    }
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        console.log("hit through url2222222222");
        console.log(url);
        if(url){
          this.handleURL(url);
        }
        
      });
    } else {
        Linking.addEventListener('url', (event)=>{
          console.log("hit hit hit22222222222222222");
          console.log(event.url);
          if(event.url){
            this.handleURL(event.url);
          }
        });
      }
}

componentWillUnmount=()=> {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);


    
      Linking.removeEventListener('url', (event)=>{
        console.log("wheevevte");
        console.log(event);
      });
    
}

onReceived(notification) {
  
}
naviagatePage = (newsid)=>{
  const { navigation } = this.props;
  navigation.navigate('NewsDetail', {newsid});
}

onOpened=(openResult)=> {
  this.naviagatePage(openResult.notification.payload.additionalData.newsid);  
}

onRegistered(notifData) {


  
}

onIds(device) {

}

  isActiveClass = (key)=>{

    if(this.props.activeItemKey.toLowerCase()===key.toLowerCase()){
      return {
        backgroundColor: appVars.colorDrawerIsActiveBackgroundColor
      };
    }

  }
  render = ()=> {

    const { navigation } = this.props
    return (
    <ScrollView style={appStyles.drawerContainer}>

      <Image source={require('../../../assets/images/logo.png')} style={appStyles.drawerLogo}/>

      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('NewsList')} >
        <View style={[appStyles.drawerItem,this.isActiveClass('newslist')]}>
          <AwseomeIcon name="home" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelNewsList.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigation.navigate('GalleryList')} >
        <View style={[appStyles.drawerItem,this.isActiveClass('gallerylist')]}>
          <AwseomeIcon name="camera-retro" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelGalleryList.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('epaper')} style={this.isActiveClass('epaper')}>
        <View style={[appStyles.drawerItem,this.isActiveClass('epaper')]}>
          <AwseomeIcon name="newspaper-o" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelePaper.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigation.navigate('MyIssues')} >
        <View style={[appStyles.drawerItem,this.isActiveClass('myissues')]}>
          <AwseomeIcon name="files-o" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelMyIssues.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('Upload')} >
        <View style={[appStyles.drawerItem,this.isActiveClass('upload')]}>
          <AwseomeIcon name="upload" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelUpload.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('Account')} style={this.isActiveClass('account')}>
        <View style={[appStyles.drawerItem,this.isActiveClass('account')]}>
          <AwseomeIcon name="user" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelAccount.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>
      
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Settings')} style={this.isActiveClass('settings')}>
        <View style={[appStyles.drawerItem,this.isActiveClass('settings')]}>
          <AwseomeIcon name="cog" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelSettings.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('Imprint')} style={this.isActiveClass('imprint')}>
        <View style={[appStyles.drawerItem,this.isActiveClass('imprint')]}>
          <AwseomeIcon name="balance-scale" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelImprint.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      
      
      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('Bookmarks')} style={this.isActiveClass('imprint')}>
        <View style={[appStyles.drawerItem,this.isActiveClass('imprint')]}>
          <AwseomeIcon name="paperclip" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelBookmarks.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('PrivacyPolicy')} style={this.isActiveClass('privacypolicy')}>
        <View style={[appStyles.drawerItem,this.isActiveClass('privacypolicy')]}>
          <AwseomeIcon name="info" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelPrivacyPolicy.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

    </ScrollView>
    )
  }
}
export default DrawerContainer;
