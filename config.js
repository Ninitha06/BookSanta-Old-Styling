 import * as firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyAFU6deTvTuMvu1m5elgLFMwitryaHrAJ0",
    authDomain: "booksantanini.firebaseapp.com",
    projectId: "booksantanini",
    storageBucket: "booksantanini.appspot.com",
    messagingSenderId: "636084460998",
    appId: "1:636084460998:web:e75e85a108d0c9aa1a26c7"
  };


  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();