import * as React from 'react';
import {View,Text,StyleSheet,FlatList} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import {ListItem} from 'react-native-elements';
import MyHeader from '../component/MyHeader';


export default class ReceivedBooksScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            allReceivedRequests : [],
            userId : firebase.auth().currentUser.email
        }

        this.receivedRef = null;
    }

    getAllReceivedBooks(){
        this.receivedRef = db.collection("received_books").where("userId","==",this.state.userId)
        .onSnapshot(snapshot=>{
            let allReceivedBooks =[];
            snapshot.docs.map((doc)=>{
                var book = doc.data()
                book["doc_id"] = doc.id
                allReceivedBooks.push(book)});
                this.setState({
                    allReceivedRequests : allReceivedBooks
                })
            })
    }

        
    keyExtractor = (item,index) => index.toString()

    renderItem = ({item,index})=>(
        <ListItem
        key={index}
        title={item.bookName}
        subtitle = {item.bookStatus}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider
        ></ListItem>
    )

    componentDidMount(){
        this.getAllReceivedBooks();
    }

    componentWillUnmount(){
        this.receivedRef();
    }


    render(){
        return(<View style={{flex:1}}>
            
            <MyHeader title="My Received Books" navigation={this.props.navigation}></MyHeader>
           
                <View style={{flex : 1}}>
                    { 
                    this.state.allReceivedRequests.length === 0?
                    (<View style={styles.subContainer}><Text style={{fontSize : 20}}>List of all Received Books</Text></View>)
                    :
                    (<FlatList
                    keyExtractor = {this.keyExtractor}
                    data = {this.state.allReceivedRequests}
                    renderItem = {this.renderItem}>
                    </FlatList>)
                    }
                </View>
            </View>);
    }
}

const styles=StyleSheet.create({
    subContainer:{
        flex:1,
        fontSize: 20,
        justifyContent:'center',
        alignItems:'center'
      },
});