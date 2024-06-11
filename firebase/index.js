// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, addDoc, deleteDoc} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSxcNm4",
  authDomain: "easy-pp.com",
  projectId: "easy73bd5",
  storageBucket: "easy-dpspot.com",
  messagingSenderId: "962403",
  appId: "1:96595c75339d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db, setDoc, getDoc, collection, doc, getAuth, onSnapshot, addDoc, getDocs, deleteDoc, signOut, onAuthStateChanged}
