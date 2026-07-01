import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

// Google Provider
const googleProvider = new GoogleAuthProvider();

// Register
export const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

// Login
export const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

// Google Login
export const loginWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
};

// Logout
export const logoutUser = async () => {
    return await signOut(auth);
};