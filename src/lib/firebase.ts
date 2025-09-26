// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-3162881255-630bb",
  "appId": "1:812390868799:web:2ef1e152e30b022465d58a",
  "apiKey": "AIzaSyAb95Af6_wwBPcRmAdx8oaiec-YqcBZgh0",
  "authDomain": "studio-3162881255-630bb.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "812390868799"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
