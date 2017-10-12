import React, { Component } from 'react'
import { StyleSheet,
    TouchableHighlight,
    Dimensions,
    View,
    Text, FlatList, TouchableOpacity } from 'react-native'
import appStyles from '../../appStyles';
import appVars from '../../appVars';
import Pdf from 'react-native-pdf';

class PDFViewScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
          page: 1
        }
      }

    handleMenuClick = async (item)=>{
    this.setState({
        page: Number(item.page),
        })
    }

    checkActiveMenu = (selectedPage)=>{
        if(this.state.page===Number(selectedPage) || this.state.currentpage===Number(selectedPage)){
          return true;
        }

      }

    renderMenuItem = (item)=>{
        return (     
          <TouchableOpacity activeOpacity = { .5 } onPress={this.handleMenuClick.bind(this,item)}>
            <View style={this.checkActiveMenu(item.page)?appStyles.subMenuItemActive:appStyles.subMenuItem}>
              <Text style={appStyles.subMenuTextLabel}>{item.section.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        );
      }

  renderSubmenu= ()=>{
    const navParams = this.props.navigation.state.params;
    let epaperindex = navParams.epaperindex;

      return (
        <View style={appStyles.subMenuContainer}>
        <FlatList
        data={epaperindex}
        extraData={this.state}
        renderItem={({item}) => this.renderMenuItem(item)}
        keyExtractor={(item,index)=> {
        return item.page;
        }}
        horizontal={true}
        />
        </View>
      );
    }

      render() {
          const navParams = this.props.navigation.state.params;
          let source = {uri:navParams.file};
          //let source = require('./test.pdf'); //maybe ios?

          return (
              
              <View style={appStyles.container}>
                <View>
                {
                    this.renderSubmenu()
                }
                </View>
                  <Pdf ref={(pdf)=>{this.pdf = pdf;}}
                      source={source}
                      page={this.state.page}
                      spacing={0}
                      horizontal={false}
                      onLoadComplete={(pageCount)=>{
                          this.setState({pageCount: pageCount});
                          //console.log(`total page count: ${pageCount}`);
                      }}
                      onPageChanged={(page,pageCount)=>{
                          this.setState({currentpage:page});
                          //console.log(`current page: ${page}`);
                      }}
                      onError={(error)=>{
                          //console.log(error);
                      }}
                      style={styles.pdf}/>
              </View>
          )
    }
  }

  const styles = StyleSheet.create({
      container: {
         
          justifyContent: 'flex-start',
          alignItems: 'center',
      },
      btn: {
          margin: 5,
          padding:5,
          backgroundColor: "blue",
      },
      btnDisable: {
          margin: 5,
          padding:5,
          backgroundColor: "gray",
      },
      btnText: {
          color: "#FFF",
      },
      pdf: {
          flex:1,
          width:Dimensions.get('window').width,
          backgroundColor: "#FFF",

      },

  });

export default PDFViewScreen;
