import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAksJ8jdi_BeV3WO1jOKiIhGslY8L4x2wA",
    authDomain: "chat-app-4b9e3.firebaseapp.com",
    projectId: "chat-app-4b9e3",
    storageBucket: "chat-app-4b9e3.firebasestorage.app",
    messagingSenderId: "764950554217",
    appId: "1:764950554217:web:c6aaf11ea63987684ae4f8",
    measurementId: "G-R1V219WKY8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;