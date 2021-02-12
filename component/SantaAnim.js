import * as React from 'react';
import LottieView from 'lottie-react-native';

export default class App extends React.Component{
    render(){
        return(<LottieView source={require('../assets/santa.json')} autoPlay loop style={{width : '60%',marginTop:40}}/>
        );
    }
}