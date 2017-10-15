"use strict"
import React, { Component } from 'react'
import { StyleSheet,
    TouchableHighlight,
    Dimensions,
    View,
    ScrollView,
    Text,
    TextInput,
    Switch,
    Button,
    Alert,
    PixelRatio,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from 'react-native'
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';

class UploadScreen extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            userTermsOfUse: false,
            avatarSource: null,        
            avatarPath: null,
            file64Data : null,
            formLoading: false
          };
    }
    onSubmit = async ()=>{
      this.setState({
        formLoading: true
      });
      const payload = {
        message: this.state.msg,
        email: this.state.email,
        phone: this.state.phone,
        imageFile:  this.state.file64Data,
        userTermsOfUse: this.state.userTermsOfUse
      }
      var data = new FormData();
      data.append( "formData",  JSON.stringify(payload));
      try {
        let response = await fetch(appVars.uploadAPI+"?authtoken="+appVars.apiKey, {
          method: 'POST',
          body: data
        });
        let jsonresponse = await response.json();
        Alert.alert(appVars.uploadAPISuccess);
      } catch (error) {
        
        Alert.alert(appVars.uploadAPIFail);
        
      }finally{
        this.setState({
          formLoading: false,
          userTermsOfUse: false,
          avatarSource: null,        
          avatarPath: null,
          file64Data : null
        });
      }
      
    }
    /*onSubmit=async ()=>{
      this.uploadImage();
      try{
      let response = await RNFetchBlob.fetch('POST', "https://api.mopo-server.de/share/app/?authtoken="+appVars.apiKey, {
        Authorization : "Bearer access-token",    
        // this is required, otherwise it won't be process as a multipart/form-data request
        'Content-Type' : 'multipart/form-data',
      }, [
        // append field data from file path
        {
          name : 'avatar',
          filename : this.state.fileName,
          type: this.state.fileType,
          // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
          // Or simply wrap the file path with RNFetchBlob.wrap().
          data: RNFetchBlob.wrap(this.state.avatarPath)
        },
      ]);

      console.log("response from upload");
      console.log(response);


    }


    catch(e){
      console.log("error in upload");
      console.log(e);
    }}
*/
    





      selectPhotoTapped() {
        const options = {
          quality: 1.0,
          maxWidth: 1600,
          maxHeight: 1600,
          title: appVars.labelSelectSource,
          cancelButtonTitle: appVars.labelCancel,
          takePhotoButtonTitle: appVars.labelFromCamera,
          chooseFromLibraryButtonTitle: appVars.labelFromLib,
            storageOptions: {
            skipBackup: true
            }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled photo picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          }
          else {

            let source = { uri: response.uri };
            
            //console.log(response.data);
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            this.setState({
              avatarSource: source,
              avatarPath: response.path,
              fileName: response.fileName,
              fileType: response.type,
              file64Data: response.data
            });
          }
        });
      }

      render() {
        if(this.state.formLoading){
          return(
            <View style={appStyles.ActivityIndicatorFullscreenContainer}>
              <ActivityIndicator animating={true} size={96}/>
            </View>
          )
        }
          return (
              <ScrollView style={appStyles.contenContainer}>

                <View style={appStyles.contentElement}>
                <Text style={appStyles.contentHeadline}>{appVars.textInstantNewsHeadline}</Text>
                <Text style={appStyles.contentText}>{appVars.textInstantNews}</Text>
                </View>

                <View style={appStyles.contentElement}>
                <Text style={appStyles.settingsColStart}>{appVars.labelMsg.toUpperCase()}</Text>
                <TextInput autoCapitalize={'none'} multiline={true} autoCorrect={true} autoGrow={true} onChangeText={(value)=> this.setState({msg: value})}/>
                </View>

                <View style={appStyles.contentElement}>
                <Text style={appStyles.settingsColStart}>{appVars.labelEmail.toUpperCase()}</Text>
                <TextInput keyboardType={'email-address'} autoCapitalize={'none'} autoCorrect={false} onChangeText={(value)=> this.setState({email: value})}/>
                </View>

                <View style={appStyles.contentElement}>
                <Text style={appStyles.settingsColStart}>{appVars.labelPhone.toUpperCase()}</Text>
                <TextInput keyboardType={'phone-pad'} autoCapitalize={'none'} autoCorrect={false} onChangeText={(value)=> this.setState({phone: value})}/>
                </View>

                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                    <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
                    { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
                        <Image style={styles.avatar} source={this.state.avatarSource} />
                    }
                    </View>
          </TouchableOpacity>


                <View style={appStyles.contentElement}>
                        <View style={appStyles.settingsWrapper}>
                            <Text style={appStyles.settingsColStart}>{appVars.labelTermsofuse}</Text>
                            <View style={appStyles.settingsColEnd}><Switch onValueChange={(value) => this.setState({userTermsOfUse: value})} value={this.state.userTermsOfUse} /></View>
                    </View>
                </View>

                <View style={appStyles.contentSeperator} />
                
                <View style={appStyles.contentElement}>
                <Button disabled={!this.state.userTermsOfUse} color={appVars.colorMain} style={appStyles.submit} title={appVars.labelSubmit} onPress={this.onSubmit.bind(this)} />
                </View>

              </ScrollView>
          )
    }
  }

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});
