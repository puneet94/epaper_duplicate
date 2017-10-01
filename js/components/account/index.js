import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, Button, Alert, ActivityIndicator, Linking } from 'react-native'
import appStyle from '../../appStyles';
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
                console.log(json["response"].userkey);
                await this.storeToken(json["response"].userkey);
            }
            else{
                this.setState({
                    loading: false,
                })
                Alert.alert("Error logging in");
                console.log("incorrect login");
            }

        }
        catch(e){
            console.log(e);
            this.setState({
                loading: false,
            })
            Alert.alert("Error logging in");
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
            <View style={styles.center}>
              <ActivityIndicator animating={true} />
            </View>
          )
      }
      if(this.state.loggedIn){
          return(
              <View>
                <Text>Already logged in</Text>
                <Button color='green' style={styles.submit} title="LOGOUT" onPress={()=>this.logout()}></Button>
              </View>
          );
      }
    return (
      <View style={appStyle.container}>
        <Text style={styles.topText}>Random heading</Text>
        <Text style={styles.middleText}>Random follow up texxt</Text>
        <Text style={styles.heading}> E-Mail</Text>
        <TextInput onChangeText={(value)=> this.setState({email: value})}/>
        <Text style={styles.heading}> Password </Text>
        <TextInput onChangeText={(value)=> this.setState({pass: value})}/>
        <View style={styles.buttonView} >
        <Button color='green' style={styles.submit} title="Submit" onPress={this.onSubmit.bind(this)} />
        </View>
        <View style={styles.buttonView} >
        <Button color='#A8A4A7' style={styles.submit} title="Forgot Password" onPress={this.onForgot} />
        </View>
      </View>
    )
  }
}

export default AccountScreen;

const styles= StyleSheet.create({
    topText:{
        fontSize: 19,
        paddingTop: 10,
        paddingLeft: 5,
    },
    middleText:{
        paddingTop: 10,
        paddingLeft: 5,
        fontSize: 17,
    },
    heading:{
        fontWeight: 'bold',
        fontSize: 15,
        paddingTop: 10,
        paddingLeft: 5,
        color: 'black'
    },
    submit:{
        borderRadius:200,
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',

    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonView:{
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        overflow: 'hidden',
        borderRadius:200,
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
    }
})
