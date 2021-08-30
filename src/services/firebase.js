import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyB4R9wcBgcRVfmCItKBbEmCUxgN6PkvUuc",
  authDomain: "diaro-a86f7.firebaseapp.com",
  projectId: "diaro-a86f7",
  storageBucket: "diaro-a86f7.appspot.com",
  messagingSenderId: "263157485049",
  appId: "1:263157485049:web:8bfc0fbbc549f476c3c128",
};

firebase.initialiseApp(firebaseConfig);

export default firebase;