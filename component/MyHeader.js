import * as React from 'react';
import {Header,Badge,Icon} from 'react-native-elements';
import {View} from 'react-native';
import db from '../config';


import firebase from 'firebase';

export default class MyHeader extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            noOfNotifications : "",
            userId : firebase.auth().currentUser.email
        }

        this.notificationCountRef=null;
    }

    IconWithBadge=()=>{
        return(<View>
            <Icon name="bell" type="font-awesome" color="#696969" size={25} onPress={()=>this.props.navigation.navigate("Notifications")}></Icon>
            <Badge value={this.state.noOfNotifications} containerStyle={{position:'absolute', top : -4, right : -4}}></Badge>
        </View>);
    }

    getNumberOfUnreadNotifications(){
        this.notificationCountRef = db.collection("all_notifications").where("notificationStatus","==","unread")
        .where("targetUserId","==",this.state.userId)
        .onSnapshot((snapshot)=>{
            var unreadNotifications = snapshot.docs.map((doc)=>doc.data())
            this.setState({
                noOfNotifications : unreadNotifications.length
            })
        })
    }

    componentDidMount(){
        this.getNumberOfUnreadNotifications();
    }

    componentWillUnmount(){
        this.notificationCountRef();
    }


    render(){
        return(
            <Header 
            leftComponent = {<Icon name="bars" type="font-awesome" color="#696969" onPress={()=>this.props.navigation.toggleDrawer()}></Icon>}
            centerComponent = {{text : this.props.title, style : {color : 'black', fontWeight : 'bold', fontSize : 20 }}}
            rightComponent = {<this.IconWithBadge{...this.props}/>}
            backgroundColor ='#eaf8fe'></Header>
        );
    }
}


