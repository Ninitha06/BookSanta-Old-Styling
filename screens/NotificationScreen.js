import * as React from 'react';
import {Text,View,FlatList,StyleSheet} from 'react-native';
import {ListItem,Icon} from 'react-native-elements';
import firebase from 'firebase';

import db from '../config';
import MyHeader from '../component/MyHeader';
import SwipableFlatlist from '../component/SwipableFlatlist'

export default class NotificationScreen extends React.Component{

    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            allNotifications : []
        }

        this.notificationRef = null;
    }

    getNotifications(){
      this.notificationRef = db.collection("all_notifications").where("targetUserId","==",this.state.userId)
        .where("notificationStatus","==","unread")
        .onSnapshot(snapshot=>{
            var allNotifications=[];
            snapshot.forEach((doc)=>{
                let notification = doc.data();
                notification["doc_id"] = doc.id;
                allNotifications.push(notification);
            })
            this.setState({
                allNotifications : allNotifications
            })
        })
    }

    componentDidMount(){
        this.getNotifications();
    }

    componentWillUnmount() {
      this.notificationRef();
    }

    keyExtractor = (item,index)=>index.toString();

    renderItem = ({item,index})=>{
        return(<ListItem
        key={index}
        leftElement = {<Icon name="book" type="font-awesome" color="#696969"/>}
        title = {item.bookName}
        titleStyle = {{color : 'black', fontWeight : 'bold'}}
        subtitle = {item.message}
        bottomDivider
        ></ListItem>)
    }
    render(){
        return(<View style={styles.container}>
            <View style={{flex:0.1}}>
              <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
            </View>
            <View style={{flex:0.9}}>
              {
                this.state.allNotifications.length === 0
                ?(
                  <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:25}}>You have no notifications</Text>
                  </View>
                )
                :(
                  <SwipableFlatlist allNotifications={this.state.allNotifications} />
                )
              }
            </View>
          </View>);
    }
}


const styles = StyleSheet.create({
    container : {
      flex : 1
    }
  })