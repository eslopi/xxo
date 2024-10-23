// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzNFMx0...",
  authDomain: "ms-mv-71de8.firebaseapp.com",
  projectId: "ms-mv-71de8",
  storageBucket: "ms-mv-71de8.appspot.com",
  messagingSenderId: "11803494011",
  appId: "1:11803494011:web:313992c0215928cb3b44de",
  measurementId: "G-XKKEK82ZPD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
