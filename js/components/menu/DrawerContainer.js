import React from 'react'
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback} from 'react-native'

import appVars from '../../appVars';
import appStyles from '../../appStyles';

import { NavigationActions } from 'react-navigation'

import AwseomeIcon from 'react-native-vector-icons/FontAwesome';

class DrawerContainer extends React.Component {
  isActiveClass = (key)=>{
    
    if(this.props.activeItemKey.toLowerCase()===key.toLowerCase()){
      return {
        backgroundColor: "black"
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
