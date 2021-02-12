
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {AppDrawerNavigator} from  './component/AppDrawerNavigator'
import { AppTabNavigator } from './component/AppTabNavigator'


export default class App extends React.Component {
  render(){
    return(<AppContainer/>);
  }
}

const switchNavigator = createSwitchNavigator({
  WelcomeScreen : {screen : WelcomeScreen},
  Drawer : {screen : AppDrawerNavigator},
  BottomTab: {screen: AppTabNavigator},
});


const AppContainer = createAppContainer(switchNavigator);