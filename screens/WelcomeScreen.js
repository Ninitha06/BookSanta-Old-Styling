import * as React from 'react';
import {View, Text, StyleSheet,TextInput,TouchableOpacity,Alert,Modal, ScrollView, KeyboardAvoidingView} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import SantaAnim from '../component/SantaAnim'

export default class WelcomeScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            emailId : '',
            password : '',
            isModalVisible : false,
            firstname : '',
            lastname : '',
            address : '',
            contact : '',
            confirmPassword : ''
        }
    }

    login = (emailId,passwd)=>{
        firebase.auth().signInWithEmailAndPassword(emailId,passwd)
        .then(()=>{
            this.props.navigation.navigate("RequestBooks");
        })
        .catch((error)=>{
            var errorCode = error.code;
            var errorMsg = error.message;
            return Alert.alert(errorMsg);
        })
    }

    signUp = (emailId,passwd,confirmPasswd)=>{
        if(passwd !== confirmPasswd){
            console.log(passwd);
            console.log(confirmPasswd);
            Alert.alert("Passwords did not match. \n Please check your passwords")
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(emailId,passwd)
            .then(()=>{
                db.collection("users").add({
                    firstName : this.state.firstname,
                    lastName : this.state.lastname,
                    contact : this.state.contact,
                    address : this.state.address,
                    emailId : this.state.emailId,
                    IsBookRequestActive: false
                })
                //iOS has style parameter
                return Alert.alert(
                    "User created succcessfully",
                    "",
                    [
                        {text : 'OK', onPress : ()=>this.setState({isModalVisible : false})}
                    ]);
            })
            .catch((error)=>{
                var errorCode = error.code;
                var errorMsg = error.message;
                return Alert.alert(errorMsg);
            })
        }
    }

    showModal = ()=>{
        return(
            <Modal animationType="fade" transparent={true} visible={this.state.isModalVisible}>
                <View style={styles.inputContainer}>
                    <ScrollView style={{width : '100%'}}>
                        <Text style={styles.signUpText}>Sign Up Form</Text>
                        <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
                            <TextInput style = {styles.inputBox} placeholder="First Name" maxLength={8} onChangeText={(text)=>this.setState({firstname : text})}></TextInput>
                            <TextInput style = {styles.inputBox} placeholder="Last Name" maxLength={8} onChangeText={(text)=>this.setState({lastname : text})}></TextInput>
                            <TextInput style = {styles.inputBox} placeholder="Contact" maxLength={10} keyboardType="numeric" onChangeText={(text)=>this.setState({contact : text})}></TextInput>
                            <TextInput style = {styles.inputBox} placeholder="Address" multiline={true} onChangeText={(text)=>this.setState({address : text})}></TextInput>
                            <TextInput style = {styles.inputBox} placeholder="email@address" keyboardType="email-address" onChangeText={(text)=>this.setState({emailId : text})}></TextInput>
                            <TextInput style = {styles.inputBox} placeholder="Password" secureTextEntry={true} onChangeText={(text)=>this.setState({password : text})}></TextInput>
                            <TextInput style = {styles.inputBox} placeholder="Confirm Password" secureTextEntry={true} onChangeText={(text)=>this.setState({confirmPassword : text})}></TextInput>
                        </KeyboardAvoidingView>
                        <View style={{flex : 1,flexDirection : 'row',alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity style={styles.registerButton} onPress={()=>{this.signUp(this.state.emailId,this.state.password,this.state.confirmPassword)}}><Text style={styles.registerButtonText}>Register</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.registerButton} onPress={()=>this.setState({isModalVisible : false})}><Text style={styles.registerButtonText}>Cancel</Text></TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        );
    }

    render(){
        return(
        <View style={styles.container}>
            {this.showModal()}
            <View style={styles.lottieContainer}>
                <SantaAnim/>
            <Text style ={styles.santaText}>Book Santa</Text>
            </View>
            <KeyboardAvoidingView style={styles.inputContainer} behaviour="height">
                <TextInput style={styles.loginBox} placeholder = "youremailaddress@com" keyboardType = "email-address" 
                    onChangeText ={(text)=>this.setState({emailId : text})}/>
                <TextInput style={styles.loginBox} placeholder = "Your Password" secureTextEntry={true} 
                    onChangeText ={(text)=>this.setState({password : text})}/>
            </KeyboardAvoidingView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={()=>this.login(this.state.emailId,this.state.password)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>this.setState({isModalVisible : true})}>
                    <Text style={styles.buttonText}>SignUp</Text>
                </TouchableOpacity>
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    container : {
        flex:1,
        backgroundColor:'#F8BE85',
        alignItems: 'center',
        justifyContent: 'center'
    },
    lottieContainer : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    },
    inputContainer : {
        flex:1,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ffff",
        marginRight:30,
        marginLeft : 30,
        marginTop:80,
        marginBottom:80,
    },
    buttonContainer : {
        flex : 1
    },
    santaText : {
        fontSize:50,
        marginTop : 30,
        fontWeight:'300',
        paddingBottom:30,
        color : '#ff3d00'
    },
    inputBox : {
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
    },
    button : {
        width:300,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
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
        marginBottom : 10

    },
    buttonText : {
        color:'#ffff',
        fontWeight:'200',
        fontSize:20
    },

    signUpText : {
        justifyContent:'center',
        alignSelf:'center',
        fontSize:30,
        color:'#ff5722',
        margin:50
    },

    KeyboardAvoidingView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
      },

      registerButton:{
        width:100,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderRadius:10,
        marginTop:30,
        marginLeft : 30
      },
      registerButtonText:{
        color:'#ff5722',
        fontSize:15,
        fontWeight:'bold'
      },
      loginBox:{
        width: 300,
        height: 40,
        borderBottomWidth: 1.5,
        borderColor : '#ff8a65',
        fontSize: 20,
        margin:10,
        paddingLeft:10
      },
});