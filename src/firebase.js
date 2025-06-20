// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb43sYwB0d-aQjPpASAWiXN_IAu-m_AHA",
  authDomain: "dlvery-80b08.firebaseapp.com",
  projectId: "dlvery-80b08",
  storageBucket: "dlvery-80b08.firebasestorage.app",
  messagingSenderId: "1094030516782",
  appId: "1:1094030516782:web:3194dd172efd77f9d335bf",
  measurementId: "G-MSMGMFFM85"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
  
  // Test auth initialization
  getAuth(app);
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { app };