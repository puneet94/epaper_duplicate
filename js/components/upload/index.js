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
    TouchableWithoutFeedback,
    Image,
    Modal,
} from 'react-native'
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import HTMLView from 'react-native-htmlview';
import store from 'react-native-simple-store';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import { em, lineHeight, handleExternalUrl } from '../../core/helpers';

class UploadScreen extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            userTermsOfUse: false,
            imageSorce: null,        
            imagePath: null,
            file64Data : null,
            formLoading: false,
            modalVisible: false,
            fontSize: appVars.baseUnit            
          };
    }


    componentWillMount = async ()=>{
    store.delete('deepLinkNewsId');
    }

    setModalVisible(visible) {
      this.setState({modalVisible: visible});
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
        let response = await fetch(appVars.apiUrl+"/fileupload.html?authtoken="+appVars.apiKey, {
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
          imageSorce: null,        
          imagePath: null,
          file64Data : null
        });
      }
      
    }

      selectPhotoTapped() {
        const options = {
          quality: 1.0,
          maxWidth: 2400,
          maxHeight: 2400,
          title: appVars.labelSelectSource,
          cancelButtonTitle: appVars.labelCancel,
          takePhotoButtonTitle: appVars.labelFromCamera,
          chooseFromLibraryButtonTitle: appVars.labelFromLib,
            storageOptions: {
            skipBackup: true
            }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          //console.log('Response = ', response);
    
          if (response.didCancel) {
            //console.log('User cancelled photo picker');
          }
          else if (response.error) {
            //console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            //console.log('User tapped custom button: ', response.customButton);
          }
          else {

            let source = { uri: response.uri };
            
            //console.log(response.data);
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            this.setState({
              imageSorce: source,
              imagePath: response.path,
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
              <ActivityIndicator animating={true} size={'large'}/>
            </View>
          )
        }
          return (
              <ScrollView style={appStyles.contenContainer}>

              <Modal
              animationType={appVars.animationType}
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {console.log("Modal has been closed.")}}
              >
              <ScrollView style={appStyles.contenContainer}>
              <View style={appStyles.contentElement}>

              <HTMLView addLineBreaks={false} value={appVars.htmlUpload} 
          
                stylesheet={StyleSheet.create({
                  p: {
                    fontSize: em(0.875),
                    lineHeight: lineHeight(0.875,150),
                    fontFamily: appVars.fontText,
                    color: appVars.colorBlack,
                    marginBottom: em(0.875),
                    paddingLeft: 20,
                    paddingRight: 20,
                  },
                  strong: {
                    fontWeight: '700'
                  },
                  a: {
                    color: appVars.colorMain,
                    fontWeight: '700',
                  },
                  h3: {
                    fontSize: em(1.250),
                    lineHeight: lineHeight(1.250,120),
                    fontFamily: appVars.fontHeadline,
                    color: appVars.colorBlack,
                    marginBottom: em(0.500),
                  }
                })  
                }
                
                onLinkPress={(url) => handleExternalUrl(url)} />
                
            
              <Button color={appVars.colorMain} style={appStyles.submit} title="Fenster schließen" onPress={() => { this.setModalVisible(!this.state.modalVisible) }} />
           
              </View>
              </ScrollView>
              

              </Modal>

                <View style={appStyles.contentElement}>
                <Text style={appStyles.contentText}>{appVars.textInstantNews}</Text>
                </View>

                <View style={appStyles.contentElement}>
                <Text style={appStyles.settingsColStart}>{appVars.labelMsg.toUpperCase()}</Text>
                <TextInput style={appStyles.formImput} autoCapitalize={'none'} multiline={true} autoCorrect={true} autoGrow={true} onChangeText={(value)=> this.setState({msg: value})}/>
                </View>

                <View style={appStyles.contentElement}>
                <Text style={appStyles.settingsColStart}>{appVars.labelEmail.toUpperCase()}</Text>
                <TextInput style={appStyles.formImput} keyboardType={'email-address'} autoCapitalize={'none'} autoCorrect={false} onChangeText={(value)=> this.setState({email: value})}/>
                </View>

                <View style={appStyles.contentElement}>
                <Text style={appStyles.settingsColStart}>{appVars.labelPhone.toUpperCase()}</Text>
                <TextInput style={appStyles.formImput} keyboardType={'phone-pad'} autoCapitalize={'none'} autoCorrect={false} onChangeText={(value)=> this.setState({phone: value})}/>
                </View>

          <View style={[appStyles.contentElement,styles.container]}>
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                    <View style={[styles.image, styles.imageContainer]}>
                    { this.state.imageSorce === null ?
                        <Text>
                        {appVars.labelSelectPhoto}
                        </Text>
                        :
                        <Image style={styles.image} source={this.state.imageSorce} />
                    }
                    </View>
                </TouchableOpacity>
                </View>

                <View style={appStyles.contentElement}>
                        <View style={appStyles.settingsWrapper}>

                        <TouchableOpacity onPress={() => {this.setModalVisible(true)}}>
                          <View>
                            <Text style={appStyles.settingsColStart}>{appVars.labelTermsofuse}</Text>
                            </View>
                        </TouchableOpacity>
                            <View style={appStyles.settingsColEnd}><Switch onValueChange={(value) => this.setState({userTermsOfUse: value})} value={this.state.userTermsOfUse} /></View>
                    </View>
                </View>

                <View style={appStyles.contentSeperator} />
                
                <View style={appStyles.contentElement}>
                <Button disabled={!this.state.userTermsOfUse || !this.state.phone || !this.state.email} color={appVars.colorMain} style={appStyles.submit} title={appVars.labelSubmit} onPress={this.onSubmit.bind(this)} />
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
  },
  imageContainer: {
    borderColor: '#000',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});
