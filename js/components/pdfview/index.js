import React, { Component } from 'react'
import { StyleSheet,
    TouchableHighlight,
    Dimensions,
    View,
    Text } from 'react-native'
import appStyle from '../../appStyles';
import Pdf from 'react-native-pdf';

class PDFViewScreen extends Component {

      render() {
          const navParams = this.props.navigation.state.params;
          let source = {uri:navParams.file};
          //let source = require('./test.pdf'); //maybe ios?

          return (
              <View style={styles.container}>

                  <Pdf ref={(pdf)=>{this.pdf = pdf;}}
                      source={source}
                      page={1}
                      spacing={0}
                      horizontal={false}
                      onLoadComplete={(pageCount)=>{
                          this.setState({pageCount: pageCount});
                          //console.log(`total page count: ${pageCount}`);
                      }}
                      onPageChanged={(page,pageCount)=>{
                          this.setState({page:page});
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
          flex: 1,
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
