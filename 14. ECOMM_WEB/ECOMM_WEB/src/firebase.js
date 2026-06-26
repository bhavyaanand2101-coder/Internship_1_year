// Firebase imports - needed for authentication
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration object containing project credentials
// This connects our app to the Firebase backend
const firebaseConfig = {
  apiKey: "AIzaSyCXTIb50YM7RmGH-UhB10m_XSSTyslUy54",
  authDomain: "ecomm-app-6c9d6.firebaseapp.com",
  projectId: "ecomm-app-6c9d6",
  storageBucket: "ecomm-app-6c9d6.firebasestorage.app",
  messagingSenderId: "474601028654",
  appId: "1:474601028654:web:21e58d8f608354be2bf3bf"
};

// Initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);

// Get Firebase authentication instance - used for login/signup
export const auth = getAuth(app);

// Create Google provider for "Sign in with Google" functionality
export const googleProvider = new GoogleAuthProvider();