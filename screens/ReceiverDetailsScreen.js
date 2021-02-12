import * as React from 'react';
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native';

import {Card, Header, Icon} from 'react-native-elements';

import firebase from  'firebase';
import db from '../config';

export default class ReceiverDetailsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            receiverEmailId : this.props.navigation.getParam("details")["userId"],
            userId : firebase.auth().currentUser.email,
            userName : '',
            bookName : this.props.navigation.getParam("details")["bookName"],
            reasonToRequest : this.props.navigation.getParam("details")["reasonToRequest"],
            requestId : this.props.navigation.getParam("details")["requestId"],
            receiverName : '',
            receiverContact : '',
            receiverAddress : '',
          //  receiverRequestDocId : ''
        }
    }

    getReceiverDetails(){
        db.collection("users").where("emailId",'==',this.state.receiverEmailId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverName : doc.data().firstName,
                    receiverContact : doc.data().contact,
                    receiverAddress : doc.data().address
                });
            })
            
        })
    }

    componentDidMount(){
        this.getReceiverDetails();
        this.getUserDetails();
    }

    updateBookStatus(){
        db.collection("all_donations").add({
            bookName : this.state.bookName,
            requestedBy : this.state.receiverName,
            requestId : this.state.requestId,
            donorId: this.state.userId,
            requestStatus : "Donor Interested"
        });
    }

    addNotification(){
        var message = this.state.userId + " has shown interest in donating the book";
        db.collection("all_notifications").add({
            targetUserId : this.state.receiverEmailId,
            donorId : this.state.userId,
            requestId : this.state.requestId,
            bookName : this.state.bookName,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            notificationStatus : "unread",
            message : message
        })

    }

    getUserDetails(){
        db.collection("users").where("emailId","==",this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    userName : doc.data().firstName + " " + doc.data().lastName
                })
            })
        })
    }


    render(){
        return(<View style={{flex : 1}}>
            <View style={{flex:0.1}}>
            <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Receiver Details", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
            backgroundColor = "#eaf8fe"
          />
            </View>
            <View style={{flex:0.3}}>
                <Card title="Book Information" titleStyle={{fontSize : 20}}>
                    <Card>
                        <Text style={{fontWeight : 'bold'}}>Name : {this.state.bookName}</Text>
                    </Card>
                    <Card>
                        <Text style={{fontWeight : 'bold'}}>Reason to Request : {this.state.reasonToRequest}</Text>
                    </Card>
                </Card>
            </View>
            <View style={{flex : 0.3}}>
                <Card title="Receiver Information" titleStyle={{fontSize:20}}>
                    <Card>
                        <Text style={{fontWeight : 'bold'}}>Receiver Name : {this.state.receiverName}</Text>
                    </Card>
                    <Card>
                        <Text  style={{fontWeight : 'bold'}}>Receiver Contact : {this.state.receiverContact}</Text>
                    </Card>
                    <Card>
                        <Text  style={{fontWeight : 'bold'}}>Receiver Address : {this.state.receiverAddress}</Text>
                    </Card>
                </Card>
            </View>
            <View style={{flex : 0.3,justifyContent:'flex-end',alignItems:'center'}}>
                {
                this.state.receiverEmailId!=this.state.userId?
                (<TouchableOpacity style={styles.button} onPress={()=>{
                    this.updateBookStatus();
                    this.addNotification();
                    this.props.navigation.navigate('MyDonations');
                }}>
                    <Text style={styles.buttonText}>I want to Donate</Text></TouchableOpacity>)
                : null
                } 
            </View>
        </View>);
    }
}


const styles = StyleSheet.create({
    button : {
        width:"75%",
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:"#ff9800",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
        marginBottom : 20

},
buttonText : {
    color:'#ffff',
    fontWeight:'200',
    fontSize:25
},
});