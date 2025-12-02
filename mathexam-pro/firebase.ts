import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBfcevjeuuAiU822qkZU6AmO6Rgt4Lxo0",
  authDomain: "webtoananphuc.firebaseapp.com",
  projectId: "webtoananphuc",
  storageBucket: "webtoananphuc.firebasestorage.app",
  messagingSenderId: "632182376940",
  appId: "1:632182376940:web:1b8ca5ae32ef129d95d8c9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);