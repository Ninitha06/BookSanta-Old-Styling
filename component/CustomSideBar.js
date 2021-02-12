import * as React from 'react';
import { TouchableOpacity,Text,View,StyleSheet} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';

import firebase from 'firebase';
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import db from '../config';





export default class CustomSideBar extends React.Component{

    constructor(){
      super();
      this.state = {
        userId : firebase.auth().currentUser.email,
        image : '#',
        name : ''
      }

      var userRef = null;
    }

    selectPicture = async()=>{
      const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
        mediaTypes : ImagePicker.MediaTypeOptions.All,
        allowsEditing : true,
        aspect : [4,3],
        quality : 1
      })

      if(!cancelled){
        this.uploadImage(uri,this.state.userId);
      }
    }

    uploadImage=async(uri, imageName)=>{
      var response = await fetch(uri);
      var blob = await response.blob();


      var ref = firebase.storage().ref().child("user_profiles/" + imageName);

      return ref.put(blob).then((response)=>{
        this.fetchImage(imageName);
      })
    }


    fetchImage = (imageName) =>{
      var storageRef = firebase.storage().ref().child("user_profiles/" + imageName);

      storageRef.getDownloadURL().then((url)=>this.setState({image:url}))
      .catch((error)=>{
        this.setState({image : '#'})
      })
    }

    getUserName = ()=>{
      userRef = db.collection("users").where("emailId","==",this.state.userId)
      .onSnapshot((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.setState({
            name : doc.data().firstName + " " + doc.data().lastName
          })
        })
      })
    }

    componentDidMount(){
      this.getUserName();
      this.fetchImage(this.state.userId);
    }

    componentWillUnmount(){
      this.userRef();
    }



    render(){
        return(<View style={styles.container}>
            <View style={styles.drawerItemsContainer}>
              <Avatar
              rounded
              source = {{uri : this.state.image}}
              size = "medium"
              onPress = {()=>this.selectPicture()}
              containerStyle = {styles.imageContainer}
              showEditButton
              ></Avatar>
              <Text style={{fontSize:20,fontWeight:'bold',paddingTop:10,alignSelf:'center'}}>{this.state.name}</Text>
            <DrawerItems {...this.props}/>
            </View>
            <View style={styles.logOutContainer}>
            <TouchableOpacity style={styles.logOutButton} onPress={()=>{
                firebase.auth().signOut()
                this.props.navigation.navigate('WelcomeScreen')}}><Text style={styles.logOutText}>Logout</Text></TouchableOpacity>
            </View></View>)
    }
}


const styles = StyleSheet.create({
    container : {
        flex : 1
    },

    drawerItemsContainer:{
        flex:0.8,
      },
      logOutContainer : {
        flex:0.2,
        justifyContent:'flex-end',
        paddingBottom:30
      },
      logOutButton : {
        height:30,
        width:'100%',
        justifyContent:'center',
        alignItems : 'center',
        padding:10
      },
      logOutText:{
        fontSize: 20,
        fontWeight:'bold'
      },
      imageContainer:{
        flex : 0.75,
        width : '80%',
        height : '20%',
        marginTop : 30,
        marginLeft : 20,
      }
})