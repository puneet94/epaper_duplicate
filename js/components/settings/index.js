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
    Slider,
    Platform
} from 'react-native'
import store from 'react-native-simple-store';
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import OneSignal from 'react-native-onesignal';
import Toast, {DURATION} from 'react-native-easy-toast';

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

        if(Platform.OS === 'android') {        
            ToastAndroid.show(`Push-Nachrichten ${value?"eingeschaltet":"ausgeschaltet"}`, ToastAndroid.SHORT);
            } else {
            this.refs.toast.show(`Push-Nachrichten ${value?"eingeschaltet":"ausgeschaltet"}`, 2000);
          }
      }
      
      render() {
          return (
        <View style={appStyles.contenContainer}>
            <Toast ref="toast" style={appStyles.iOSToast} textStyle={appStyles.iOSToastText}/>
            <View style={appStyles.contentElement}>
                <Text style={appStyles.contentHeadline}>{appVars.textPushnotificationsHeadline}</Text>
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
                        <Slider style={appStyles.settingsSlider} value={this.state.fontSize} minimumValue={16} maximumValue={24} onValueChange={(itemValue, itemIndex) => {this.setState({userFontSize: Math.round(itemValue),fontSize:Math.round(itemValue)});store.save('fontSize',itemValue)}}/>
                    </View>
                </View>
            </View>
        </View>
        )
    }
  }

export default SettingsScreen;
