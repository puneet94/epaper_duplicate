"use strict"
import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    Button, Alert,
    ActivityIndicator,
    Linking
} from 'react-native'
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import store from 'react-native-simple-store';


class AccountScreen extends Component {

    componentWillMount(){
        this.load();
    }


    load = async () => {
        try {
          const token = await store.get(appVars.STORAGE_KEY)

          if (token !== null) {
            this.setState({
                loggedIn: true,
            })
          }
        } catch (e) {
          console.log(e);
        }
      }

    constructor(props){
        super(props);
        this.state={
            email: '',
            pass: '',
            loading: false,
            loggedIn: false,
        }
    }

    storeToken = async (name) => {
        try {
          await store.save(appVars.STORAGE_KEY, name)
          
          this.setState({
              loggedIn: true,
              loading: false,
          })
        } catch (e) {
          console.log(e)
        }
      }

    onSubmit=async function (){
        //Alert.alert("email: "+ this.state.email + "pass: " + this.state.pass);
        this.setState({
            loading: true,
        })
        let apiHitPoint = appVars.apiUrl+"?authtoken="+appVars.apiKey+"&username="+this.state.email+"&password="+this.state.pass;
        
        let that=this;
        try{
            const response = await fetch(apiHitPoint);
            const json = await response.json();
            if(json["@status"] === "OK"){
                
                await this.storeToken(json["response"].userkey);
            }
            else{
                this.setState({
                    loading: false,
                })
                Alert.alert(appVars.textErrorLogin);
               // console.log("incorrect login");
            }

        }
        catch(e){
            console.log(e);
            this.setState({
                loading: false,
            })
            Alert.alert(appVars.textErrorLogin);
        }

    };
    onForgot= function (){
      Linking.canOpenURL(appVars.forgotpasswordurl).then(supported => {
            if (supported) {
              Linking.openURL(appVars.forgotpasswordurl);
            } else {
              console.log("Don't know how to open URI: " + appVars.forgotpasswordurl);
            }
        });
    };
    logout = async ()=>{
        this.setState({
            loading: true
        });
        await store.delete(appVars.STORAGE_KEY);
        this.setState({
            loggedIn: false,
            loading:false
        });
    }
    
  render= ()=> {
        
      if(this.state.loading)
      {
          return(
            <View style={appStyles.ActivityIndicatorFullscreenContainer}>
              <ActivityIndicator animating={true} size={'large'}/>
            </View>
          )
      }
      if(this.state.loggedIn){
          return(
              <View style={appStyles.contenContainer}>
                <View style={appStyles.contentElement}>
                    <Text style={appStyles.contentHeadline}>{appVars.textLogout}</Text>
                    <Text style={appStyles.contentText}>{appVars.textLogutFollowup}</Text>
                </View>
                
                <View style={appStyles.contentSeperator} />
                
                <View style={appStyles.contentElement}>
                    <Button color={appVars.colorMain} style={appStyles.submit} title={appVars.labelLogoutButton} onPress={()=>this.logout()} />
                </View>

              </View>
          );
      }
    return (
      <View style={appStyles.contenContainer}>
        <View style={appStyles.contentElement}>
            <Text style={appStyles.contentHeadline}>{appVars.textLogin}</Text>
            <Text style={appStyles.contentText}>{appVars.textLoginFollowup}</Text>
        </View>

        <View style={appStyles.contentElement}>
        <Text style={appStyles.settingsColStart}>{appVars.labelEmail.toUpperCase()}</Text>
        <TextInput style={appStyles.formInput} keyboardType={'email-address'} autoCapitalize={'none'} autoCorrect={false} onChangeText={(value)=> this.setState({email: value})}/>
        </View>

        <View style={appStyles.contentElement}>
        <Text style={appStyles.settingsColStart}>{appVars.labelPassword.toUpperCase()} </Text>
        <TextInput style={appStyles.formInput} secureTextEntry={true} autoCapitalize={'none'} autoCorrect={false} onChangeText={(value)=> this.setState({pass: value})}/>
        </View>

        <View style={appStyles.contentElement}>
        <Button color={appVars.colorMain} style={appStyles.submit} title={appVars.labelLoginButton} onPress={this.onSubmit.bind(this)} />
        </View>

        <View style={appStyles.contentSeperator} />
        
        <View style={appStyles.contentElement}>
        <Button color={appVars.colorDarkGray} style={appStyles.submit} title={appVars.labelForgotPassword} onPress={this.onForgot} />
        </View>
      </View>
    )
  }
}

export default AccountScreen;
