import React from 'react'
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback} from 'react-native'

import appVars from '../../appVars';
import appStyles from '../../appStyles';

import { NavigationActions } from 'react-navigation'

import AwseomeIcon from 'react-native-vector-icons/FontAwesome';

import OneSignal from 'react-native-onesignal'; // Import package from node modules


class DrawerContainer extends React.Component {

  componentWillMount() {
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
}

componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
}

onReceived(notification) {
    console.log("Notification received: ", notification);
}

onOpened(openResult) {
  console.log('Message: ', openResult.notification.payload.body);
  console.log('Data: ', openResult.notification.payload.additionalData);
  console.log('isActive: ', openResult.notification.isAppInFocus);
  console.log('openResult: ', openResult);
}

onRegistered(notifData) {
    console.log("Device had been registered for push notifications!", notifData);
}

onIds(device) {
console.log('Device info: ', device);
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
    <View style={appStyles.drawerContainer}>

      <Image source={require('../../../assets/images/logo.png')} style={appStyles.drawerLogo}/>

      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('Home')} style={this.isActiveClass('home')}>
        <View style={[appStyles.drawerItem,this.isActiveClass('home')]}>
          <AwseomeIcon name="home" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelHome.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigation.navigate('MyIssues')} >
        <View style={[appStyles.drawerItem,this.isActiveClass('myissues')]}>
          <AwseomeIcon name="newspaper-o" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelMyIssues.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('NewsList')} >
        <View style={[appStyles.drawerItem,this.isActiveClass('newslist')]}>
          <AwseomeIcon name="file-text-o" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelNewsList.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigation.navigate('GalleryList')} >
        <View style={[appStyles.drawerItem,this.isActiveClass('gallerylist')]}>
          <AwseomeIcon name="camera" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelGalleryList.toUpperCase()}</Text>
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
      
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Settings')} style={this.isActiveClass('settings')}>
        <View style={[appStyles.drawerItem,this.isActiveClass('settings')]}>
          <AwseomeIcon name="cog" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelSettings.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigation.navigate('Account')} style={this.isActiveClass('account')}>
        <View style={[appStyles.drawerItem,this.isActiveClass('account')]}>
          <AwseomeIcon name="user" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelAccount.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

    </View>
    )
  }
}
export default DrawerContainer;
