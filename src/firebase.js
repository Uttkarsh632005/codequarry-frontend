import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAtDm9g2ca76tM4YEPSfgDVWP3c9v_G53Y",
  authDomain: "brandminer-6f7bd.firebaseapp.com",
  projectId: "brandminer-6f7bd",
  storageBucket: "brandminer-6f7bd.firebasestorage.app",
  messagingSenderId: "140699349285",
  appId: "1:140699349285:web:51ff3fca901b3089882acc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();