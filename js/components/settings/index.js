"use strict"
import React, { Component } from 'react';
import { 
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    View,
    Text,
    Switch,
    Picker,
    Slider
} from 'react-native'
import appStyles from '../../appStyles';
import appVars from '../../appVars';

class SettingsScreen extends Component {

    constructor(props){
            super(props);
            this.state = {
                userFontSize: 16,
                userPushnotification: true,
            }
        }
      
      render() {
          return (
        <View style={appStyles.contenContainer}>

            <View style={appStyles.contentElement}>
            <Text style={appStyles.contentHeadline}>{appVars.textPushnotificationsHeadline}</Text>
            <Text style={appStyles.contentText}>{appVars.textPushnotifications}</Text>
                <View style={appStyles.settingsWrapper}>
                    <Text style={appStyles.settingsColStart}>{appVars.labelPushnotifications}</Text>
                    <View style={appStyles.settingsColEnd}><Switch onValueChange={(value) => this.setState({userPushnotification: value})} value={this.state.userPushnotification} /></View>
               </View>
            </View>
            
            <View style={appStyles.contentSeperator} />

            <View style={appStyles.contentElement}>    
                <Text style={appStyles.contentHeadline}>{appVars.textFontsizeHeadline}</Text>
                <Text style={appStyles.contentText}>{appVars.textFontsize}</Text>
                
                <View style={appStyles.settingsWrapper}>    
                    <Text style={appStyles.settingsColStart}>{appVars.labelFontsize}</Text>
                    <View style={appStyles.settingsColEnd}>
                        <Slider style={appStyles.settingsSlider} minimumValue={16} maximumValue={24} onValueChange={(itemValue, itemIndex) => this.setState({userFontSize: Math.round(itemValue)})}/>
                    </View>
                </View>
            </View>
        </View>
        )
    }
  }

export default SettingsScreen;
