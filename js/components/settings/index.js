"use strict"
import React, { Component } from 'react';
import { 
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    View,
    Text,
    Alert,
    Switch,
    Picker,
    ToastAndroid,
    Slider
} from 'react-native'
import store from 'react-native-simple-store';
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import OneSignal from 'react-native-onesignal'
class SettingsScreen extends Component {
    constructor(props){
            super(props);
            this.state = {
                userFontSize: 16,
                userPushnotification: true,
            }
        }
      componentWillMount = async()=>{
        let fontSize = Number.parseInt(await store.get('fontSize'),10);
        if(fontSize){
          this.setState({
            fontSize
          });
        }
        OneSignal.getPermissionSubscriptionState((status)=>{
            this.setState({
                userPushnotification: status.subscriptionEnabled
            });
            
        });
      }
      changePushNotification = (value)=>{
        this.setState({userPushnotification: value});
        OneSignal.setSubscription(value);
        ToastAndroid.show(`Push notifications ${value?"enabled":"disabled"}`, ToastAndroid.SHORT);
      }
      
      render() {
          return (
        <View style={appStyles.contenContainer}>

            <View style={appStyles.contentElement}>
                <Text style={[appStyles.contentHeadline,{fontSize:this.state.fontSize}]}>{appVars.textPushnotificationsHeadline}</Text>
                <Text style={appStyles.contentText}>{appVars.textPushnotifications}</Text>
                <View style={appStyles.settingsWrapper}>
                    <Text style={appStyles.settingsColStart}>{appVars.labelPushnotifications}</Text>
                    <View style={appStyles.settingsColEnd}>
                        <Switch onValueChange={ this.changePushNotification} value={this.state.userPushnotification} />
                    </View>
               </View>
            </View>
            
            <View style={appStyles.contentSeperator} />

            <View style={appStyles.contentElement}>    
                <Text style={appStyles.contentHeadline}>{appVars.textFontsizeHeadline}</Text>
                <Text style={appStyles.contentText}>{appVars.textFontsize}</Text>
                
                <View style={appStyles.settingsWrapper}>    
                    <Text style={appStyles.settingsColStart}>{appVars.labelFontsize}</Text>
                    <View style={appStyles.settingsColEnd}>
                        <Slider style={appStyles.settingsSlider} value={this.state.fontSize} step={2} minimumValue={16} maximumValue={42} onValueChange={(itemValue, itemIndex) => {this.setState({userFontSize: itemValue,fontSize:itemValue});store.save('fontSize',itemValue)}}/>
                    </View>
                </View>
            </View>
        </View>
        )
    }
  }

export default SettingsScreen;
