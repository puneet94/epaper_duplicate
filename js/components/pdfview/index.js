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
        const navParams = this.props.navigation.state.params;
        let epaperindex = navParams.epaperindex;
       
        this.state = {
          page: 1,
          currentMenuIndex: 1,
            epaperindex
        }
      }

    handleMenuClick = async (item)=>{
    this.setState({
        page: Number(item.page),
        })
    }
    checkActiveMenu = (selectedPage)=>{
        if(this.state.currentMenuIndex==selectedPage){
            return true;
        }/*
        if(this.state.page===Number(selectedPage) || this.state.currentpage===Number(selectedPage)){
          return true;
        }*/
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
      activeMenuIndex = (pageNo)=>{
          if(this.state.epaperindex){
            let epaperindex = this.state.epaperindex;
            let currentMenuIndex = 1;
            let scrollIndex = 0;
          for(let i= epaperindex.length-1;i>=0;i--){
              if(pageNo>=epaperindex[i].page){
                  currentMenuIndex = epaperindex[i].page
                  scrollIndex = i;
                  break;     
              }
          }
         this.menuList.scrollToIndex({ index: scrollIndex });
          this.setState({
              currentMenuIndex ,
              scrollIndex
          });
          }
          
      }
  renderSubmenu= ()=>{
    const navParams = this.props.navigation.state.params;
    let epaperindex = navParams.epaperindex;
    
        console.log(navParams);
      return (
        <View style={appStyles.subMenuContainer}>
        <FlatList
        data={epaperindex}
        extraData={this.state}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => this.renderMenuItem(item)}
        keyExtractor={(item,index)=> {
        return item.page;
        }}
        horizontal={true}
        ref={(ref) => { this.menuList = ref; }}
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
                          this.activeMenuIndex(page);
                        console.log("the current");
                          console.log(`current page: ${page}`);
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
