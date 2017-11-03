import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableWithoutFeedback} from 'react-native'

import appVars from '../../appVars';
import appStyles from '../../appStyles';

import { NavigationActions } from 'react-navigation'

import AwseomeIcon from 'react-native-vector-icons/FontAwesome';

import OneSignal from 'react-native-onesignal'; // Import package from node modules

import store from 'react-native-simple-store';
class DrawerContainer extends React.Component {

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
}

componentWillUnmount=()=> {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
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
