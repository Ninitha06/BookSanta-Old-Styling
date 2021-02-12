import {createStackNavigator} from 'react-navigation-stack';

import * as React from 'react';

import BookDonateScreen from '../screens/BookDonateScreen';
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';



export const AppStackNavigator = createStackNavigator({
    BookDonateList : {
        screen : BookDonateScreen,
        navigationOptions:{
            headerShown : false
          }
    },
    ReceiverDetail : {
        screen : ReceiverDetailsScreen,
        navigationOptions : {
            headerShown : false
        }
    },
},
{
    initialRouteName : 'BookDonateList'
})