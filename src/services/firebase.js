import firebase from "firebase/app"
import "firebase/auth";
import "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyB4R9wcBgcRVfmCItKBbEmCUxgN6PkvUuc",
  authDomain: "diaro-a86f7.firebaseapp.com",
  projectId: "diaro-a86f7",
  storageBucket: "diaro-a86f7.appspot.com",
  messagingSenderId: "263157485049",
  appId: "1:263157485049:web:8bfc0fbbc549f476c3c128",
});

export const auth = app.auth()
export const db = app.firestore();
export default app;