import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUzUIoq99qIHUaVyngZxipwF3aiojvI_c",
  authDomain: "instagram-clone-68d7c.firebaseapp.com",
  projectId: "instagram-clone-68d7c",
  storageBucket: "instagram-clone-68d7c.appspot.com",
  messagingSenderId: "461667892163",
  appId: "1:461667892163:web:33f8459bf7137176521b76",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db, storage };
