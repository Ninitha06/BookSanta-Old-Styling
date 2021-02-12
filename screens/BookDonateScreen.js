//import React,{Component} from 'react'; this will also work
import * as React from 'react';
import {Text,View,StyleSheet,TouchableOpacity,FlatList} from 'react-native';
import { ListItem } from 'react-native-elements';
import MyHeader from '../component/MyHeader';
import firebase from 'firebase';
import db from '../config';


export default class BookDonateScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            requestList : []
        }
        this.requestRef = null;
    }

    getRequestList =()=>{
        this.requestRef = db.collection("requested_books").where("bookStatus","==","requested")
        .onSnapshot((snapshot)=>{
            //var requestList = snapshot.docs.map(document=>return document.data());
            var requestList = snapshot.docs.map((document)=>{return document.data()});
           
            this.setState({
                requestList : requestList
            })
        })
    }

    componentDidMount(){
        this.getRequestList();
    }

    componentWillUnmount(){
        this.requestRef();
    }

    keyExtractor = (item,index) => index.toString()

    renderItem = ({item,i})=>{
        return(
            <ListItem
            key={i}
            title={item.bookName}
            subtitle = {item.reasonToRequest}
            titleStyle = {{color: 'black', fontWeight : 'bold'}}
            rightElement ={
                <TouchableOpacity style={styles.button} 
                onPress={()=>{this.props.navigation.navigate("ReceiverDetail",{"details" : item})}}>
                    <Text style={{color:'black'}}>View</Text>
                    </TouchableOpacity>
            }
            bottomDivider
            ></ListItem>
        );
    }

    render(){
        return(<View style={{flex:1}}>
            <MyHeader title="Donate Books" navigation={this.props.navigation}></MyHeader>
                <View style={{flex : 1}}>
                    {
                    console.log("Renderlist " + this.state.requestList.length)}
                    {this.state.requestList.length === 0?
                    (<Text style={{fontSize : 20}}>List of all Requested Books</Text>)
                    :
                    (<FlatList
                    keyExtractor = {this.keyExtractor}
                    data = {this.state.requestList}
                    renderItem = {this.renderItem}>
                    </FlatList>)}
                </View>
            </View>);
    }
}




const styles = StyleSheet.create({
    button : {
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8
         },
    }
})