import React, { Component } from 'react'
import { Text, View } from 'react-native'
import store from 'react-native-simple-store';

import appStyle from '../../appStyles';


class IssuesScreen extends Component {

  componentDidMount(){

    // Get localstored updated object
    store.get('localepapers')
    .then((res) =>
    	console.log(res.path)
    );
    
  }

  render() {
    const { navigation } = this.props
    return (
      <View style={appStyle.container}>

        <Text>My Issues</Text>

      </View>
    )
  }
}
export default IssuesScreen;
