import React from 'react'
import { StyleSheet, Text, View, Image, StatusBar, TouchableWithoutFeedback} from 'react-native'

import appVars from '../../appVars';
import appStyles from '../../appStyles';

import { NavigationActions } from 'react-navigation'

import AwseomeIcon from 'react-native-vector-icons/FontAwesome';

class DrawerContainer extends React.Component {

  render() {
    const { navigation } = this.props
    return (
    <View style={appStyles.drawerContainer}>

      <StatusBar backgroundColor={appVars.colorMain} barStyle="light-content"/>

      <Image source={require('../../../assets/images/logo.png')} style={appStyles.drawerLogo}/>

      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('Home')}>
        <View style={appStyles.drawerItem}>
          <AwseomeIcon name="home" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelHome.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigation.navigate('MyIssues')}>
        <View style={appStyles.drawerItem}>
          <AwseomeIcon name="newspaper-o" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelMyIssues.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={appStyles.drawerSeperator} />

      <TouchableWithoutFeedback onPress={() => navigation.navigate('Account')}>
        <View style={appStyles.drawerItem}>
          <AwseomeIcon name="user" style={appStyles.drawerIcon}/>
          <Text style={appStyles.drawerLabel}>{appVars.labelAccount.toUpperCase()}</Text>
        </View>
      </TouchableWithoutFeedback>

    </View>
    )
  }
}
export default DrawerContainer;
