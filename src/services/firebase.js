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

const auth = app.auth();
const db = app.firestore();

// Sign in With Email And Password
const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Signup with Email and Password
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res.user;
    await db.collection("users").add({
      uid: user.uid,
      name,
      email,
    });
  } catch (err) {
    alert(err.message);
  }
};

// Sending Reset Password Email
const sendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    alert(err.message);
  }
};

// Logging out user
const logout = () => {
  auth.signOut();
};

export {
  auth,
  db,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  logout,
};