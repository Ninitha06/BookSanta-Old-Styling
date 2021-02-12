import * as React from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert} from 'react-native';

import firebase from 'firebase';
import db from '../config';
import MyHeader from '../component/MyHeader';

export default class SettingsScreen extends React.Component{

    constructor(){
        super();
        this.state = {
            emailId : '',
            firstname : '',
            lastname : '',
            contact : '',
            address : '',
            docId : ''
        }
    }

    getUserDetails(){
        var user = firebase.auth().currentUser;
        var email = user.email;

        db.collection('users').where('emailId','==',email).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                var data = doc.data();
                this.setState({
                    emailId : data.emailId,
                    firstname : data.firstName,
                    lastname : data.lastName,
                    contact : data.contact,
                    address : data.address,
                    docId : doc.id
                })
            })
        })
    }

    componentDidMount(){
        this.getUserDetails();
    }

    updateDetails(){
        db.collection('users').doc(this.state.docId)
        .update({
            firstName : this.state.firstname,
            lastName : this.state.lastname,
            contact : this.state.contact,
            address : this.state.address,
        })

        Alert.alert("User updated successfully");

    }

    render(){
        return(
        <View style={{flex : 1}}>
            <MyHeader title="Settings" navigation={this.props.navigation}></MyHeader>
            <View style={{alignItems : 'center', justifyContent : 'center'}}>
                <TextInput style={styles.formInput} placeholder={"First Name"} onChangeText={(text)=>{this.setState({firstname : text})}} value={this.state.firstname}></TextInput>
                <TextInput style={styles.formInput} placeholder={"Last Name"}onChangeText={(text)=>{this.setState({lastname : text})}} value={this.state.lastname}></TextInput>
                <TextInput style={styles.formInput} placeholder={"Contact"} onChangeText={(text)=>{this.setState({contact : text})}} value={this.state.contact}></TextInput>
                <TextInput style={styles.multilineText} placeholder={"Address"} onChangeText={(text)=>{this.setState({address : text})}} multiline={true} numberOfLines={8} value={this.state.address}></TextInput>
                <TouchableOpacity style={styles.button} onPress={()=>this.updateDetails()}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
            </View>
        </View>);
    }
}


const styles=StyleSheet.create({
    formInput : {
        width:"75%",
        //height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
    },
    multilineText : {
        textAlignVertical:'top',
        width:"75%",
        //height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
    },
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
        padding: 10,
        marginTop : 20

    },
    buttonText : {
        color:'#ffff',
        fontWeight:'200',
        fontSize:25
    },

})