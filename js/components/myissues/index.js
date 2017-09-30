import React, { Component } from 'react'
import { Text,View,StyleSheet,Dimensions,Image,FlatList,TouchableOpacity } from 'react-native'
import store from 'react-native-simple-store';
import appStyle from '../../appStyles';
import appVars from '../../appVars';
import { NavigationActions } from 'react-navigation';
class IssuesScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      myissues: null
    }
  }
  componentDidMount = async ()=>{

    // Get localstored updafappted object
    store.get('localepapers')
    .then((res) =>
    	console.log(res.path)
    );
    let issues = await store.get('userIssues');
    console.log("got issues");
    console.log(issues);
    this.setState({
      myissues: issues
    });
    
  }
  renderIssue = (item)=>{
    console.log("got item");
    console.log(item);

    const { navigation } = this.props;
    return (
    <View style={styles.issue}>
      <TouchableOpacity activeOpacity = { .5 } onPress={ ()=>{
        navigation.navigate('PDFView', {file: item.path});
        }}>
          <Image style={styles.image} source={{uri:'file://'+item.thumbNail}} >
            {(this.state.downloading && (this.state.currentItem==item.id))?<ActivityIndicator size="large" color="green"/>:<View></View>}
          </Image>
        </TouchableOpacity>
        <Text style={styles.details}>{item["date"]}</Text>
    </View>
    );
  }

  
  renderIssues = ()=>{
    return (
      <FlatList
      data={this.state.myissues}
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
      <View style={appStyle.container}>
        <Text style={styles.issuesText}>My Issues</Text>
        <View style={{flex:1}}>
        {
          this.state.myissues && this.renderIssues()
        }
        </View>
      </View>
    )
  }
}
export default IssuesScreen;

var swidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
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
    justifyContent: "center",
    alignItems: "center"
  },
  issue:{
    marginTop: 20,
    marginBottom: 10
  },
  details:{
    fontWeight: 'bold',
  }
});

