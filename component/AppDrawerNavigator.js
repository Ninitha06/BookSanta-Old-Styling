import * as React from 'react';

import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBar from './CustomSideBar';
import SettingsScreen from '../screens/SettingsScreen';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ReceivedBooksScreen from '../screens/ReceivedBooksScreen';


export const AppDrawerNavigator = createDrawerNavigator({
    Home : {
        screen : AppTabNavigator
    },
    MyDonations : {
        screen : MyDonationsScreen
    },
    MyReceivedBooks : {
        screen : ReceivedBooksScreen
    },
    Notifications : {
        screen : NotificationScreen
    },
    Settings : {
        screen : SettingsScreen
    },   
},
{
    contentComponent : CustomSideBar
},
{
    initialRouteName : 'Home'
})


