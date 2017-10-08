import React, { Component } from 'react'
import { StyleSheet,
    TouchableHighlight,
    Dimensions,
    View,
    Text } from 'react-native'
import appStyles from '../../appStyles';

class SettingsScreen extends Component {

      render() {
          return (
              <View style={appStyles.container}>
                <Text>- Pushnotifications Yes/No</Text>
                <Text>- Maybe a select where the user can change the numbers the number of "myissues" which keep stored - like a default of 30.. its bigger then 30 delete it automaticly on appstart. </Text>
                <Text>- Fontsize: normal,big,bigger - there is a value multiplicator in appStyles and htmlStyles.. names base_unit = 16; </Text>
              </View>
          )
    }
  }

export default SettingsScreen;
