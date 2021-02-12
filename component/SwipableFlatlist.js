import * as React from 'react';
import {View,Text,StyleSheet,Animated,Dimensions} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {ListItem,Icon} from 'react-native-elements';

import db from '../config';


export default class SwipableFlatlist extends React.Component{
    constructor(props){
        super(props);
        this.state={
            allNotifications : this.props.allNotifications,
        }
    }

    updateMarkAsRead = notification => {
        console.log(notification.doc_id);
        db.collection("all_notifications").doc(notification.doc_id)
        .update({
            notificationStatus : 'read'
        })
    }

    renderHiddenItem = () => (
        <View style={styles.rowBack}>
          <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
            <Text style={styles.backTextWhite}>Mark as read</Text>
          </View>
        </View>
      );

    onSwipeValueChange = swipeData => {
        var allNotifications = this.state.allNotifications;
        
        const {key, value} = swipeData;
      
        if(value< -Dimensions.get("window").width){
            const newData = [...allNotifications];
            this.updateMarkAsRead(allNotifications[key]);
            newData.splice(key,1);

            this.setState({
                allNotifications : newData
            })
        }
    }

    renderItem = data => (
        <Animated.View>
            <ListItem
            leftElement = {<Icon name="book" type="font-awesome" color="#696969"></Icon>}
            title = {data.item.bookName}
            titleStyle = {{color:'black', fontWeight:'bold'}}
            subtitle= {data.item.message}
            bottomDivider
            >

            </ListItem>
        </Animated.View>
    )

    render(){
        return(<View style={styles.container}>
            <SwipeListView 
            disableRightSwipe
            data={this.state.allNotifications}
            renderItem={this.renderItem}
            rightOpenValue={-Dimensions.get("window").width}
            onSwipeValueChange = {this.onSwipeValueChange}
            keyExtractor = {(item,index)=>index.toString()}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            renderHiddenItem = {this.renderHiddenItem}
            />
        </View>);
    }
}


const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flex: 1
    },
    backTextWhite: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 15,
      // textAlign: "center",
      // alignSelf: "flex-start"
    },
    rowBack: {
      // alignItems: "center",
      // backgroundColor: "#29b6f6",
      flex: 1,
      flexDirection: "row",
      // justifyContent: "space-between",
      // paddingLeft: 15
    },
    backRightBtn: {
      alignItems: "center",
      bottom: 0,
      justifyContent: "center",
      position: "absolute",
      top: 0,
      width: 100,
      backgroundColor: "#29b6f6",
      right: 0
    },
    backRightBtnRight: {
     
    }
  });