// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "splitwise-23240.firebaseapp.com",
  projectId: "splitwise-23240",
  storageBucket: "splitwise-23240.appspot.com",
  messagingSenderId: "348753388931",
  appId: "1:348753388931:web:7e19cae19dd208bfa082b6",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = firebase.firestore();
export default firebase;
export { db };
export const storage = getStorage(app);
