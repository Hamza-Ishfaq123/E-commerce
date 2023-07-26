
import { initializeApp } from "firebase/app";
import {getAuth}  from 'firebase/auth'
import {getFirestore}  from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBA6fqLdLCPLzZm_LYy2O7aZxh5bPn4ecI",
  authDomain: "shopifyyy-2f1be.firebaseapp.com",
  projectId: "shopifyyy-2f1be",
  storageBucket: "shopifyyy-2f1be.appspot.com",
  messagingSenderId: "413024314097",
  appId: "1:413024314097:web:cf4a10fd5469e577d07f50"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
export const storage=getStorage(app);
export default app;
