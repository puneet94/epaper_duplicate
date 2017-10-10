
import React, { Component } from 'react'
import { ToastAndroid,Platform,Text,Button,View,StyleSheet,Dimensions,FlatList,TouchableOpacity,Alert } from 'react-native';
import Image from 'react-native-scalable-image';
import store from 'react-native-simple-store';
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import { NavigationActions } from 'react-navigation';
import AwseomeIcon from 'react-native-vector-icons/FontAwesome';


class IssuesScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      myissues: null,
      deletedIssues: [],
      enabledEdit: false
    }
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: <View>
      {params.enabledEdit?
      <View style={{flexDirection:"row"}}>
        <TouchableOpacity style={appStyles.iconWrapper} onPress={()=>{params.selectAll();}}><AwseomeIcon size={24} name="check"  color="black"/></TouchableOpacity>
        <TouchableOpacity style={appStyles.iconWrapper} onPress={()=>{params.confirmDelete();}}><AwseomeIcon size={24} name="trash"  color={params.deletedIssues.length?appVars.colorMain:appVars.colorDrawerIsActiveBackgroundColor}/></TouchableOpacity>
        <TouchableOpacity style={appStyles.iconWrapper} onPress={()=>{params.resetDelete();}}><AwseomeIcon size={24} name="times"  color={appVars.colorMain} /></TouchableOpacity>
      </View>:
      <TouchableOpacity style={appStyles.iconWrapper} onPress={()=>{params.startEdit();}}>
        <AwseomeIcon size={24} name="pencil" style={{alignSelf:"flex-end",paddingRight:15}} color={appVars.colorMain}/>
      </TouchableOpacity>}
    </View>
    };
  };

 
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
      getDeletedIssues: this.getDeletedIssues

    });
  }
  
  getDeletedIssues = () =>{
    
    return this.state.deletedIssues;
  }
  getEnabledEdit = () => {
    
    return this.state.enabledEdit;
  }
  componentWillUpdate = (nextProps,nextState)=> {
    if (this.props !== nextProps) {
      if (nextProps.navigation) {
        //console.log("yes");
        //console.log(nextProps);
        //console.log(nextState);
        /*nextProps.navigation.setParams({ 
          confirmDelete: this.confirmDelete ,
          enabledEdit: nextState.enabledEdit,
          selectAll: this.selectAll,
          deletedIssues: nextState.deletedIssues,
          startEdit: this.startEdit,
          resetDelete: this.resetDelete
        });*/
      }
    }
  }  
  getMyIssues = async ()=>{


    let issues = await store.get('userIssues');

    this.setState({
      myissues: issues
    });
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
  showIssue = (item)=>{
    if(this.state.enabledEdit){
      let deletedIndex = this.checkIssueInDeleted(item);
      if(deletedIndex==-1){
        this.setState({
          deletedIssues: [...this.state.deletedIssues,item]
        });
      }else{
        this.setState({
          
          deletedIssues: [...this.state.deletedIssues.slice(0, deletedIndex),
            ...this.state.deletedIssues.slice(deletedIndex + 1)]
        })
      }

    }else{
      const { navigation } = this.props;
      navigation.navigate('PDFView', {file: item.path, epaperindex: item.epaperindex});
    }

  }

  renderIssue = (item)=>{

    return (
    <View style={appStyles.myIssuesEditionWrapper}>      
      <TouchableOpacity style={appStyles.imageBorder} activeOpacity = { .5 } onPress={ ()=>{
        this.showIssue(item)
        }}>
        <Image maxWidth={(Dimensions.get('window').width*0.333)-15} source={{uri:'file://'+item.thumbNail}} >
          {this.state.enabledEdit && <View style={[appStyles.myIssueSelect,this.checkSelected(item)]}>
          </View>}
        </Image>
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
  setStaticValues = ()=>{
    
    IssuesScreen.enabledEdit = this.state.enabledEdit;
    IssuesScreen.deletedIssues = this.state.deletedIssues;
    
  }
  resetDelete = ()=>{
    this.setState({
      enabledEdit: false,
      deletedIssues: []
    });
  }
  selectAll = ()=>{
    this.setState({
      deletedIssues: this.state.myissues
    });
  }
  confirmDelete = ()=>{

    
    if(this.state.deletedIssues.length===0){
      ToastAndroid.show(appVars.textNoIssueSelected, ToastAndroid.SHORT);
      return;
    }else{
      Alert.alert(
        appVars.textDeleteIssues,
        `Are you sure you want to delete these ${this.state.deletedIssues.length} issues`,
        [
          {text: appVars.labelDelete, onPress: () => this.startDelete() },
          {text: appVars.labelCancel, onPress: () => console.log('OK Pressed'),style: 'cancel'},
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
    await store.delete('userIssues');
    for(let i = 0;i<myissues.length;i++){
      await store.push('userIssues',myissues[i] );
    }
    this.setState({
      myissues,
      deletedIssues:[],
      enabledEdit: false
    })
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
    getDeletedIssues: this.getDeletedIssues

  });}
}
  render=()=> {

    const { navigation } = this.props
    this.setStaticValues();
    return (
      <View style={appStyles.container}>
        
          <View style={appStyles.myIssuesMainContainer}>
          {
            this.state.myissues && this.renderIssues()
          }
          </View>
        
      </View>
    )
  }
}
export default IssuesScreen;