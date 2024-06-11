// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, addDoc, deleteDoc} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHuMy6e5gMjdeMHUJqXISmz8d--OxcNm4",
  authDomain: "easy-data-manager-73bd5.firebaseapp.com",
  projectId: "easy-data-manager-73bd5",
  storageBucket: "easy-data-manager-73bd5.appspot.com",
  messagingSenderId: "96595762403",
  appId: "1:96595762403:web:0b33e93f753705c75339d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db, setDoc, getDoc, collection, doc, getAuth, onSnapshot, addDoc, getDocs, deleteDoc, signOut, onAuthStateChanged}