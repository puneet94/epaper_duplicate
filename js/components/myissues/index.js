
import React, { Component } from 'react'
import {
  ToastAndroid,
  Platform,
  Text,
  Button,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  NativeModules
} from 'react-native';
import store from 'react-native-simple-store';
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import { NavigationActions } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'react-native-fetch-blob';
import Toast, {DURATION} from 'react-native-easy-toast'

var PSPDFKit = NativeModules.PSPDFKit;

if(Platform.OS != 'android') {
  PSPDFKit.setLicenseKey(appVars.PDFVIEWER_KEY);
}

class IssuesScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      myissues: null,
      deletedIssues: [],
      enabledEdit: false,
      deSelectedAll: true,
      selectedAll: false
    }
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: <View>
      {params.enabledEdit?
      <View style={{flexDirection:"row",width:100}}>
        {params.deSelectedAll && <TouchableOpacity style={appStyles.iconWrapper} onPress={()=>{params.selectAll();}}><AwseomeIcon size={24} name="check-circle-o"  color={appVars.colorBlack}/></TouchableOpacity>}
        {params.selectedAll && <TouchableOpacity style={appStyles.iconWrapper} onPress={()=>{params.deSelectAll();}}><AwseomeIcon size={24} name="check-circle-o"  color={appVars.colorBlack}/></TouchableOpacity>}
        <TouchableOpacity style={appStyles.iconWrapper} onPress={()=>{params.confirmDelete();}}><AwseomeIcon size={24} name="trash"  color={params.deletedIssues.length?appVars.colorBlack:appVars.colorDrawerIsActiveBackgroundColor}/></TouchableOpacity>
        <TouchableOpacity style={appStyles.iconWrapper} onPress={()=>{params.resetDelete();}}><AwseomeIcon size={24} name="times"  color={appVars.colorBlack} /></TouchableOpacity>
      </View>:
      <TouchableOpacity style={appStyles.iconWrapper} onPress={()=>{params.startEdit();}}>
        <AwseomeIcon size={24} name="edit" style={{alignSelf:"flex-end",paddingRight:15}} color={appVars.colorBlack}/>
      </TouchableOpacity>}
    </View>
    };
  };



  componentWillMount = async ()=>{

    /*
    const dirs = RNFetchBlob.fs.dirs
    const x = "file://"+"/storage/emulated/0/Download/emepaper/494";
    try {
      let exist = await RNFetchBlob.fs.exists(x);
      console.log("exists");
      console.log(exist);
      let deleted = await RNFetchBlob.fs.unlink(x);
      console.log("deleted");
      console.log(deleted);
        
    } catch (error) {
      console.log("error or roda");
      console.log(error);
    }
    PSPDFKit.present(x, appVars.PDFVIEWER_CONFIGURATION);      */
  }


 
  componentDidMount =  ()=>{
    this.getMyIssues();
    this.props.navigation.setParams({ 
      confirmDelete: this.confirmDelete ,
      enabledEdit: this.state.enabledEdit,
      selectAll: this.selectAll,
      deletedIssues: this.state.deletedIssues,
      startEdit: this.startEdit,
      resetDelete: this.resetDelete,
      getEnabledEdit: this.getEnabledEdit,
      getDeletedIssues: this.getDeletedIssues,
      deSelectAll: this.deSelectAll,
      selectedAll: this.state.selectedAll,
      deSelectedAll: this.state.deSelectedAll
    });
  }
  
  getDeletedIssues = () =>{
    
    return this.state.deletedIssues;
  }
  getEnabledEdit = () => {
    
    return this.state.enabledEdit;
  }
  
  getMyIssues = async ()=>{

    
const  compare = (key)=> {
  
  return (a,b)=>{
  	if (a[key] < b[key])
    return -1;
  if (a[key] > b[key])
    return 1;
  return 0;	
  }
}
    let issues = await store.get('userIssues');
   //console.log("issues");
   //console.log(issues);
   if(issues){
    this.setState({
      myissues: issues.sort(compare("id")).reverse()
    });
   }
    
  }
  checkIssueInDeleted = (item)=>{
    let deletedIssues = this.state.deletedIssues;
    for(let i=0;i<deletedIssues.length;i++){
      if(deletedIssues[i].id==item.id){
        return i;

      }
    }
    return -1;
  }

  checkSelected = (item)=>{
    if(this.checkIssueInDeleted(item)!=-1){
      return {
        backgroundColor: appVars.colorActive
      };
    }
  }
  checkSelectedAll = ()=>{
    //console.log(this.state.deletedIssues);
    if(this.state.myissues.length===this.state.deletedIssues.length){
      this.setState({
        deSelectedAll: false,
        selectedAll: true
      });
    }else{
      this.setState({
        deSelectedAll: true,
        selectedAll: false
      });
    }
  }
  showIssue = (item)=>{
    if(this.state.enabledEdit){
      let deletedIndex = this.checkIssueInDeleted(item);
      if(deletedIndex==-1){
        this.setState({
          deletedIssues: [...this.state.deletedIssues,item]
        },()=>{
          this.checkSelectedAll();
        });
      }else{
        this.setState({
          deletedIssues: [...this.state.deletedIssues.slice(0, deletedIndex),
            ...this.state.deletedIssues.slice(deletedIndex + 1)]
        },()=>{
          this.checkSelectedAll();
        });
      }
    }else{

      const { navigation } = this.props;

      //console.log("path");
      //console.log(item.path);
      PSPDFKit.present(item.path, appVars.PDFVIEWER_CONFIGURATION);      


    }
  }

  ratioImageHeigh = (width,height,multiplicate) =>{
    return height*(appVars.screenX*multiplicate/width);
  }

  renderIssue = (item)=>{
    return (
   
    <View style={appStyles.myIssuesEditionWrapper}>

      <TouchableOpacity style={appStyles.imageBorder} activeOpacity = { .5 } onPress={ ()=>{
        this.showIssue(item)
        }}>
        
        <ImageBackground 
                  style={{width: ((appVars.screenX*.32)-16), height: this.ratioImageHeigh(item.thumbNailWidth,item.thumbNailHeight,.32)-16}}
                  source={{uri:"file://"+item.thumbNail}}
                  >
          {this.state.enabledEdit && <View style={[appStyles.myIssueSelect,this.checkSelected(item)]}></View>}
        </ImageBackground>
        <Text style={appStyles.ePaperEditionDate}>{item["date"]}</Text>
      </TouchableOpacity>
    </View>
    );
  }
  startEdit = ()=>{
    this.setState({
      enabledEdit: true
    });
  }
  
  resetDelete = ()=>{
    this.setState({
      enabledEdit: false,
      deletedIssues: []
    });
  }
  selectAll = ()=>{
    this.setState({
      deletedIssues: this.state.myissues,
      deSelectedAll: false,
      selectedAll: true
    });
  }
  deSelectAll = ()=>{
    this.setState({
      deletedIssues: [],
      deSelectedAll: true,
      selectedAll: false
    });
  }
  confirmDelete = ()=>{

    
    if(this.state.deletedIssues.length===0){
      if(Platform.OS === 'android') {        
        ToastAndroid.show(appVars.textNoIssueSelected, ToastAndroid.SHORT);
        return;
        } else {
        this.refs.toast.show(appVars.textNoIssueSelected, 2000);
        return;
      }  

    } else {
      Alert.alert(
        appVars.textDeleteIssues,
        // Wanna delete them?
        `Möchten Sie die ${this.state.deletedIssues.length} Ausgaben wirklich löschen?`,
        [
          {text: appVars.labelDelete, onPress: () => this.startDelete() },
          {text: appVars.labelCancel, onPress: () => console.log('OK Pressed'), style: 'cancel'},
        ],
        { cancelable: true }
      );
    }
  }
  startDelete= async ()=>{
    const myissues = this.state.myissues.filter((issue)=>{
      if(this.checkIssueInDeleted(issue)==-1){
        return true;
      }else{
        return false;
      }
    });
    const deleteIssues = this.state.deletedIssues;
    
    try {
      for(let j=0;j<deleteIssues.length;j++){
        let exist = await RNFetchBlob.fs.exists("file://"+deleteIssues[j].path);
        if(exist){
          let deleted = await RNFetchBlob.fs.unlink("file://"+deleteIssues[j].path);
          console.log("deleted issue");
          console.log(deleteIssues[j].path);        
        }
      }
      await store.delete('userIssues');
      for(let i = 0;i<myissues.length;i++){
        await store.push('userIssues',myissues[i] );
      }
      this.setState({
        myissues,
        deletedIssues:[],
        enabledEdit: false
      })  
    } catch (error) {
      console.log("error");
      console.log(error);
    }
    
  }
  renderIssues = ()=>{
    return (
      <FlatList
      data={this.state.myissues}
      extraData={this.state}
      numColumns={3}
      keyExtractor={(item,index)=> {
        return item.path;
        }}
      renderItem={({item}) => this.renderIssue(item)}
     />
    );
  }
componentDidUpdate = (prevProps,prevState)=>{
  if(prevState.deletedIssues.length!==this.state.deletedIssues.length || prevState.enabledEdit !==this.state.enabledEdit){
  
  
  this.props.navigation.setParams({ 
    confirmDelete: this.confirmDelete ,
    enabledEdit: this.state.enabledEdit,
    selectAll: this.selectAll,
    deletedIssues: this.state.deletedIssues,
    startEdit: this.startEdit,
    resetDelete: this.resetDelete,
    getEnabledEdit: this.getEnabledEdit,
    getDeletedIssues: this.getDeletedIssues,
    deSelectAll: this.deSelectAll,
    selectedAll: this.state.selectedAll,
    deSelectedAll: this.state.deSelectedAll

  });}
}
  render=()=> {

    const { navigation } = this.props
    
    return (
      <View style={appStyles.container}>
            <Toast ref="toast" style={appStyles.iOSToast} textStyle={appStyles.iOSToastText}/>
        
          {
            this.state.myissues && this.renderIssues()
          }
      </View>
            )
  }
}
export default IssuesScreen;