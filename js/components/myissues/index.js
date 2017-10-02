import React, { Component } from 'react'
import { ToastAndroid,Platform,Text,View,StyleSheet,Dimensions,Image,FlatList,TouchableOpacity,Alert } from 'react-native'
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
  static navigationOptions = ({navigation})=>{
    return {
      header: null
      //headerMode: 'none'
    };
 
  getMyIssues = async ()=>{


    let issues = await store.get('userIssues');
    
    this.setState({
      myissues: issues
    });
  }
  componentDidMount =  ()=>{    
    this.getMyIssues();
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
        backgroundColor: 'red'
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
      navigation.navigate('PDFView', {file: item.path});
    }

  }

  renderIssue = (item)=>{

    return (
    <View style={styles.issue}>
      <TouchableOpacity activeOpacity = { .5 } onPress={ ()=>{
        this.showIssue(item)
        }}>
          <Image style={styles.image} source={{uri:'file://'+item.thumbNail}} >
            {this.state.enabledEdit && <View style={[{width: 42,
              height: 42,
              borderRadius: 21,
              marginRight: 5,
              marginTop:5,
              borderColor:"black",
              borderWidth: 2},this.checkSelected(item)]}>
            </View>}
          </Image>
        </TouchableOpacity>
        <Text style={styles.details}>{item["date"]}</Text>
    </View>
    );
  }
  startEdit = ()=>{
    this.setState({
      enabledEdit: true
    },()=>{
      
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
      deletedIssues: this.state.myissues
    });
  }
  confirmDelete = ()=>{
    if(this.state.deletedIssues.length===0){
      ToastAndroid.show('No issue selected', ToastAndroid.SHORT);
      return;
    }else{
      Alert.alert(
        'Delete Issues',
        `Are you sure you want to delete these ${this.state.deletedIssues.length} issues`,
        [
          {text: 'Delete', onPress: () => this.startDelete() },
          {text: 'Cancel', onPress: () => console.log('OK Pressed'),style: 'cancel'},
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
      numColumns={2}
      keyExtractor={(item,index)=> {
        return item.path;
        }}
      renderItem={({item}) => this.renderIssue(item)}
     />
    );
  }
 
  render=()=> {
    
    const { navigation } = this.props
    return (
      <View style={appStyles.container}>
        <View style={styles.headerContainer}>
          <View style={{flex:1,flexDirection:"row"}}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('DrawerOpen')}>
              <AwseomeIcon size={20} name="bars" style={{paddingLeft:15,marginTop:3}} color="black"/>
            </TouchableOpacity>
            <View style={{marginLeft: 35,alignItems:"flex-start"}}>
              <Text style={{color:"black",fontSize: 20,fontWeight:'600'}}>{"MY ISSUES"}</Text>
            </View>
          </View>
          {this.state.enabledEdit?
          <View style={{flex:0.5,flexDirection:"row",justifyContent:"space-around"}}>
            <AwseomeIcon size={24} name="check"  color="black" onPress={()=>this.selectAll()}/>
            <AwseomeIcon size={24} name="trash"  color={this.state.deletedIssues.length?"black":"#b2b2b2"} onPress={()=>{this.confirmDelete()}}/>
            <AwseomeIcon size={24} name="times"  color="black" onPress={()=>{this.resetDelete()}}/>
            </View>:
          <TouchableOpacity onPress={()=>this.startEdit()}>
            <AwseomeIcon size={24} name="pencil-square-o" style={{paddingRight:15}} color="black"/>
          </TouchableOpacity>}
        </View>
        <View style={{flex:11}}>
          <View style={{flex:1}}>
          {
            this.state.myissues && this.renderIssues()
          }
          </View>
        </View>
      </View>
    )
  }
}
export default IssuesScreen;
const headerStyles = {
  flex:0.8,
  backgroundColor: 'white',
  justifyContent:"space-between",
  flexDirection:"row",
  paddingTop: 15,
  paddingBottom: 0,
  borderBottomWidth: 0,
  shadowColor: 'black',
  shadowOffset: { width: 10, height: 20 },
  shadowOpacity: 1,
  shadowRadius: 1,
  borderBottomColor: "black",
  elevation : 5
};
if (Platform.OS === 'ios') {
  headerStyles.borderBottomWidth= 2;
  headerStyles.borderBottomColor= 'rgba(0, 0, 0, .3)';
  
} 
var swidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  headerContainer:headerStyles,
  demo:{
    color: 'black',
  },
  issuesText:{
    color:'green'
  },
  image:{
    width: (swidth * .5)-8,
    height: 300,
    marginLeft: 5,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: appVars.colorMain,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  issue:{
    marginTop: 20,
    marginBottom: 10
  },
  details:{
    fontWeight: 'bold',
  }
});
