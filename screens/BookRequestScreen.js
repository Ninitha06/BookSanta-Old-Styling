import * as React from 'react';
import {TextInput,View,TouchableHighlight,Text,TouchableOpacity,Alert,StyleSheet,FlatList} from 'react-native';
import MyHeader from '../component/MyHeader';
import db from '../config';
import firebase from 'firebase';


import {BookSearch} from 'react-native-google-books';
import {Icon} from 'react-native-elements';



export default class BookRequestScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            bookName : '',
            reason : '',
            IsBookRequestActive : '',
            requestedBookName : '',
            bookStatus : '',
            requestId : '',
            userDocId : '',
            docId : '',
            Imagelink: '',
            dataSource:"",
            showFlatlist: false
        }

        this.bookReqRef = null;
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    addBookRequest = async (bkName, reasonToRequest)=>{
        var userId = this.state.userId;
        var userId = this.state.userId;
        var uniqueRequestId = this.createUniqueId();
        db.collection("requested_books").add({
            userId : userId,
            requestId : uniqueRequestId,
            bookName : bkName,
            reasonToRequest : reasonToRequest,
            bookStatus : "requested",
            date : firebase.firestore.FieldValue.serverTimestamp()
        })

        await this.getBookRequest();

        db.collection("users").where("emailId","==",userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("users").doc(doc.id)
                .update({IsBookRequestActive:true})
            })
        })
        
        this.setState({
            bookName : '',
            reason : '',
            requestId : uniqueRequestId
        })

        return Alert.alert("Book requested successfully");
    }


    receivedBooks = ()=>{
        db.collection("received_books").add({
            userId : this.state.userId,
            requestId : this.state.requestId,
            bookName : this.state.requestedBookName,
            bookStatus : "received"
        })
    }

    getIsBookRequestActive(){
        this.bookReqRef = db.collection("users").where("emailId","==",this.state.userId)
        .onSnapshot(snapshot=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    IsBookRequestActive:doc.data().IsBookRequestActive,
                    userDocId : doc.id
                })
            })
        })
    }

    async componentDidMount(){
        this.getIsBookRequestActive();
        this.getBookRequest();
    }

    componentWillUnmount(){
        this.bookReqRef();
    }

    getBooksFromApi=async(bookName)=>{
        this.setState({
            bookName : bookName
        })
        if(bookName.length>2){
            var books = await BookSearch.searchbook(bookName,'AIzaSyAFU6deTvTuMvu1m5elgLFMwitryaHrAJ0');

            this.setState({
                dataSource : books.data,
                showFlatlist : true,
                
            })

        
            // console.log("here is the book data volume " ,books.data[0].volumeInfo.title);
            // console.log("this is the self link ",books.data[0].selfLink);
            // console.log("this is the sale",books.data[0].saleInfo.buyLink);
            // console.log("this is imagelink",books.data[0].imageLinks);
        }
    }

    sendNotification=()=>{
        db.collection("users").where("emailId","==",this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name = doc.data().firstName;
                var lname = doc.data().lastName;

                db.collection("all_notfications").where("requestId","==",this.state.requestId).get()
                .then((snapshot)=>{
                    snapshot.forEach((doc)=>{
                        var donorId = doc.data().donorId;
                        var bname = doc.data().bookName;

                        db.collection("all_notifications").add({
                            targetUserId : donorId,
                            message : name + " " + lname + " received the book " + this.state.requestedBookName,
                            bookName : this.state.requestedBookName,
                            date : firebase.firestore.FieldValue.serverTimestamp(),
                            notificationStatus : "unread",
                            requestId : this.state.requestId
                        })
                    })
                })
            })
        })
    }

    updateBookRequestStatus=()=>{
        db.collection("requested_books").doc(this.state.docId)
        .update({
            bookStatus : "received"
        })

        db.collection("users").where("emailId","==",this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("users").doc(doc.id)
                .update({
                    IsBookRequestActive : false
                })
            })
        })
    }

    getBookRequest =()=>{
        db.collection("requested_books")
        .where("userId","==",this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().bookStatus == "requested"){
                    this.setState({
                        requestId : doc.data().requestId,
                        requestedBookName : doc.data().bookName,
                        bookStatus : doc.data().bookStatus,
                        docId : doc.id
                    })
                 }
            })
        })
    }


    //render Items  functionto render the books from api
 renderItem = ( {item, i} ) =>{
   
 
 
    return (
      <TouchableHighlight
        style={{ alignItems: "flex-start", backgroundColor: "#ffffff ",padding: 20,width: '80%'}}
        activeOpacity={0.6}
        underlayColor="#808080"
        onPress={()=>{
            this.setState({
            showFlatlist:false,
            bookName:item.volumeInfo.title,
            })}
        }
       bottomDivider
       >
        {/* Touchable Highlight can have one child..if more child, needed, wrap it in View */}
        <View style={{flexDirection:'row'}}>
           <Icon name="search" type="font-awesome" color="#696969"/>
            <Text> {item.volumeInfo.title} </Text>
        </View>
      </TouchableHighlight>
 
 
    )
  }
    
    render(){
        if(this.state.IsBookRequestActive){
            return(

                // Status screen
                <View style={{flex:1}}>
                <MyHeader title="Requested Book Status" navigation={this.props.navigation}></MyHeader>
                <View style = {{flex:0.8,justifyContent:'center'}}>
                  <View style={{borderColor:"orange",borderWidth:2,borderRadius:10,alignItems:'center',padding:10,margin:10}}>
                  <Text style={{fontWeight : 'bold'}}>Book Name</Text>
                  <Text>{this.state.requestedBookName}</Text>
                  </View>
                  <View style={{borderColor:"orange",borderWidth:2,borderRadius:10,alignItems:'center',padding:10,margin:10}}>
                  <Text style={{fontWeight : 'bold'}}> Book Status </Text>
        
                  <Text>{this.state.bookStatus}</Text>
                  </View>
                  
                  <TouchableOpacity style={[styles.button,{alignSelf:'center'}]}
                  onPress={()=>{
                    this.sendNotification()
                    this.updateBookRequestStatus();
                    this.receivedBooks()
                  }}>
                  <Text style={styles.buttonText}>Book Received</Text>
                  </TouchableOpacity>
                  </View>
                </View>
              )
        }
        else{
            return(<View style={{flex:1}}>
                <MyHeader title="Request a Book" navigation={this.props.navigation}></MyHeader>
                    <View style={{flex : 1, justifyContent:'center'}}> 
                        <TextInput style={styles.inputBox} placeholder="Name of the Book" onChangeText={text => this.getBooksFromApi(text)}
                            onClear={text => this.getBooksFromApi('')}
                            value={this.state.bookName}></TextInput>
                        
                        {  this.state.showFlatlist ?

                        (  <FlatList
                        data={this.state.dataSource}
                        renderItem={this.renderItem}
                        style={{ marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        /> )
                        :(<View style={{alignItems:'center'}}>
                        <TextInput style={styles.inputBox} placeholder="Why do you want to read the book" multiline numberOfLines = {8} onChangeText={(text)=>{this.setState({reason : text})}} value={this.state.reason}></TextInput>
                        <TouchableOpacity style={styles.button} onPress={()=>this.addBookRequest(this.state.bookName,this.state.reason)}><Text style={styles.buttonText}>Request</Text></TouchableOpacity>
                        </View>)
                        }
                    </View>
                </View>);
        }
    }
}


const styles = StyleSheet.create({
    inputBox : {
        width:"75%",
        //Do not give height when you use multiline text input.
       // height : 40,
        alignSelf:'center',
        borderColor:'#ffab91',
        //If you want the typed text to appear at the top for multiline text box
       textAlignVertical : 'top',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10,
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
        marginBottom : 20,
        marginTop:40

},
buttonText : {
    color:'#ffff',
    fontWeight:'200',
    fontSize:25
},
})