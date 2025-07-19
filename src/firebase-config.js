import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRERFB_211BptFkRS3qc7k6MGLHn1rO3A",
  authDomain: "placement-portal-2827c.firebaseapp.com",
  projectId: "placement-portal-2827c",
  storageBucket: "placement-portal-2827c.firebasestorage.app",
  messagingSenderId: "1030653263283",
  appId: "1:1030653263283:web:2a841d83e9d343cbb31fc6",
  measurementId: "G-TL3LMW5KBN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };