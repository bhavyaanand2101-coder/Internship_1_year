import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sync online status helper
    const updateUserStatus = async (uid, isOnline) => {
        try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                online: isOnline,
                lastSeen: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error updating online status:", err);
        }
    };

    // Register User
    const register = async (email, password, displayName = "") => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Set default profile if none provided
        const name = displayName || email.split("@")[0];
        const photoURL = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

        await firebaseUpdateProfile(firebaseUser, {
            displayName: name,
            photoURL,
        });

        // Create user document in firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        await setDoc(userRef, {
            uid: firebaseUser.uid,
            displayName: name,
            email: firebaseUser.email,
            photoURL,
            online: true,
            lastSeen: serverTimestamp(),
            createdAt: serverTimestamp(),
            pinnedChats: [],
            archivedChats: [],
        });

        return userCredential;
    };

    // Login User
    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Login with Google
    const loginWithGoogle = async () => {
        const googleProvider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, googleProvider);
        const firebaseUser = userCredential.user;

        // Check if user document already exists
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create user document in firestore
            await setDoc(userRef, {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || firebaseUser.email.split("@")[0],
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(firebaseUser.email)}`,
                online: true,
                lastSeen: serverTimestamp(),
                createdAt: serverTimestamp(),
                pinnedChats: [],
                archivedChats: [],
            });
        } else {
            // Document exists, mark online
            await updateUserStatus(firebaseUser.uid, true);
        }

        return userCredential;
    };

    // Reset Password
    const resetPassword = async (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // Logout
    const logout = async () => {
        if (user) {
            await updateUserStatus(user.uid, false);
        }
        return signOut(auth);
    };

    // Update Profile
    const updateProfileData = async (displayName, photoURL) => {
        if (!user) throw new Error("No authenticated user found");

        await firebaseUpdateProfile(auth.currentUser, {
            displayName,
            photoURL,
        });

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            displayName,
            photoURL,
        });
    };

    // Effect to monitor Auth state and firestore document sync
    useEffect(() => {
        let unsubscribeUserDoc = () => {};

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Set online status when session starts
                await updateUserStatus(currentUser.uid, true);

                // Listen to firestore user document in real time
                const userRef = doc(db, "users", currentUser.uid);
                unsubscribeUserDoc = onSnapshot(
                    userRef,
                    (docSnapshot) => {
                        if (docSnapshot.exists()) {
                            setUserData(docSnapshot.data());
                        }
                        setLoading(false);
                    },
                    (error) => {
                        console.error("Error reading user data snapshot:", error);
                        setLoading(false);
                    }
                );
            } else {
                setUser(null);
                setUserData(null);
                setLoading(false);
            }
        });

        // Presence listeners for tab closes
        const handlePresence = () => {
            if (auth.currentUser) {
                // We use updateDoc to synchronously start writing or beacon
                const userRef = doc(db, "users", auth.currentUser.uid);
                // Note: since updateDoc is async, in beforeunload it is best-effort.
                // But visibilitychange catches backgrounding, which is much more reliable.
                updateDoc(userRef, {
                    online: false,
                    lastSeen: serverTimestamp(),
                });
            }
        };

        const handleVisibilityChange = () => {
            if (auth.currentUser) {
                const isOnline = document.visibilityState === "visible";
                updateDoc(doc(db, "users", auth.currentUser.uid), {
                    online: isOnline,
                    lastSeen: serverTimestamp(),
                });
            }
        };

        window.addEventListener("beforeunload", handlePresence);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            unsubscribeAuth();
            unsubscribeUserDoc();
            window.removeEventListener("beforeunload", handlePresence);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const value = {
        user,
        userData,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfileData,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthContext;