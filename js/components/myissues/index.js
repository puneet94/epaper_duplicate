import React, { Component } from 'react'
import { Text,View,StyleSheet,Dimensions,Button,Image,FlatList,TouchableOpacity } from 'react-native'
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
      //header: null
      headerRight: <AwseomeIcon size={24} name="pencil-square-o" color="black" style={{paddingRight:15}} />
    };
  };


  componentDidMount = async ()=>{
    let issues = await store.get('userIssues');
    console.log("got existing my issuissues");
    console.log(issues);
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
    console.log("got item");
    console.log(item);
    console.log(this.state.enabledEdit);

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
      console.log("sdkjbfbsdfsdf");
      console.log(this.state.enabledEdit);
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
  startDelete=()=>{
    this.setState({
      myissues: [],
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


          {this.state.enabledEdit?
          <View style={{flexDirection:"row"}}>
          <AwseomeIcon size={24} name="check"  color="black" style={{paddingRight:15}} onPress={()=>this.selectAll()}/>
          <AwseomeIcon size={24} name="trash"  color="black" style={{paddingRight:15}} onPress={()=>{this.startDelete()}}/>
          <AwseomeIcon size={24} name="times"  color="black" style={{paddingRight:15}} onPress={()=>{this.resetDelete()}}/>
          </View>:
          <TouchableOpacity onPress={()=>this.startEdit()}>
            <AwseomeIcon size={24} name="pencil-square-o" style={{paddingRight:15}} color="black"/>
          </TouchableOpacity>}

          {
            this.state.myissues && this.renderIssues()
          }

      </View>
    )
  }
}
export default IssuesScreen;
var swidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  headerContainer:{
    flex:1,
    justifyContent:"space-between",
    flexDirection:"row",
    paddingTop: 15,
    paddingBottom: 0,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    borderBottomColor: "black"
  },
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
    alignItems: "flex-end",

  },
  issue:{
    marginTop: 20,
    marginBottom: 10
  },
  details:{
    fontWeight: 'bold',
  }
});
