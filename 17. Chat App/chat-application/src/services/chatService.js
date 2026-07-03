import {
    collection,
    doc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    limit,
    getDocs,
    setDoc,
    arrayUnion,
    arrayRemove,
    writeBatch,
    startAfter,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/firebase";

// Helper to generate a consistent chat ID between two users
export const getConversationId = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
};

export const sendMessage = async ({
    senderId,
    senderName,
    receiverId,
    text = "",
    imageFile = null,
    audioFile = null,
    replyTo = null,
}) => {
    if (!text.trim() && !imageFile && !audioFile) {
        throw new Error("Cannot send empty message.");
    }

    const conversationId = getConversationId(senderId, receiverId);
    let imageUrl = null;
    let audioUrl = null;

    // 1. Upload image if present
    if (imageFile) {
        const storageRef = ref(storage, `chats/${conversationId}/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
    }

    // 2. Upload audio if present
    if (audioFile) {
        const storageRef = ref(storage, `chats/${conversationId}/${Date.now()}_voice.mp3`);
        const snapshot = await uploadBytes(storageRef, audioFile);
        audioUrl = await getDownloadURL(snapshot.ref);
    }

    // 3. Add message document to Firestore
    const messageData = {
        conversationId,
        senderId,
        senderName,
        receiverId,
        text: text.trim(),
        image: imageUrl,
        audio: audioUrl,
        mediaType: audioFile ? "audio" : null,
        createdAt: serverTimestamp(),
        edited: false,
        deleted: false,
        status: "sent", // sent, delivered, read
        replyTo: replyTo
            ? {
                  messageId: replyTo.id,
                  text: replyTo.text,
                  senderName: replyTo.senderName,
                  image: replyTo.image,
              }
            : null,
    };

    return await addDoc(collection(db, "messages"), messageData);
};

// Edit message text
export const editMessage = async (messageId, newText) => {
    if (!newText.trim()) throw new Error("Message text cannot be empty.");
    const messageRef = doc(db, "messages", messageId);
    return await updateDoc(messageRef, {
        text: newText.trim(),
        edited: true,
    });
};

// Delete message (soft delete)
export const deleteMessage = async (messageId) => {
    const messageRef = doc(db, "messages", messageId);
    return await updateDoc(messageRef, {
        text: "This message was deleted",
        deleted: true,
        image: null,
    });
};

// Listen for messages in real time (sorted in-memory to avoid Firestore composite index requirements)
export const listenToMessages = (myUid, partnerUid, limitCount, callback) => {
    const conversationId = getConversationId(myUid, partnerUid);
    
    // Simple query on a single equality filter (no composite index required)
    const q = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId)
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const docs = [];
            snapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });

            // Sort by createdAt ascending in-memory, safely handling null timestamps (local optimistic updates)
            docs.sort((a, b) => {
                const aTime = a.createdAt?.toMillis 
                    ? a.createdAt.toMillis() 
                    : a.createdAt?.seconds 
                    ? a.createdAt.seconds * 1000 
                    : (a.createdAt || 0);
                const bTime = b.createdAt?.toMillis 
                    ? b.createdAt.toMillis() 
                    : b.createdAt?.seconds 
                    ? b.createdAt.seconds * 1000 
                    : (b.createdAt || 0);
                return aTime - bTime;
            });

            callback(docs, null);
        },
        (error) => {
            console.error("Error listening to messages:", error);
        }
    );
};

// Fetch older messages (stubbed as we do pagination locally in React state now)
export const fetchOlderMessages = async (myUid, partnerUid, lastVisibleDoc, limitCount) => {
    return { messages: [], lastDoc: null };
};

// Mark all unread messages received from a partner as 'read'
export const markMessagesAsRead = async (myUid, partnerUid) => {
    const conversationId = getConversationId(myUid, partnerUid);
    const q = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        where("receiverId", "==", myUid),
        where("status", "!=", "read")
    );

    try {
        const snapshot = await getDocs(q);
        if (snapshot.empty) return;

        const batch = writeBatch(db);
        snapshot.forEach((d) => {
            batch.update(doc(db, "messages", d.id), { status: "read" });
        });
        await batch.commit();
    } catch (err) {
        console.error("Error marking messages as read:", err);
    }
};

// Update typing status in real time
export const setTypingStatus = async (myUid, partnerUid, isTyping) => {
    const conversationId = getConversationId(myUid, partnerUid);
    const typingRef = doc(db, "typing", conversationId);
    
    await setDoc(
        typingRef,
        {
            [myUid]: isTyping,
        },
        { merge: true }
    );
};

// Listen for typing status
export const listenToTypingStatus = (myUid, partnerUid, callback) => {
    const conversationId = getConversationId(myUid, partnerUid);
    const typingRef = doc(db, "typing", conversationId);

    return onSnapshot(
        typingRef,
        (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                // Check if partner is typing
                callback(!!data[partnerUid]);
            } else {
                callback(false);
            }
        },
        (error) => {
            console.error("Error listening to typing status:", error);
        }
    );
};

// Pin/Unpin conversation for a user
export const togglePinConversation = async (myUid, partnerUid, shouldPin) => {
    const userRef = doc(db, "users", myUid);
    await updateDoc(userRef, {
        pinnedChats: shouldPin ? arrayUnion(partnerUid) : arrayRemove(partnerUid),
    });
};

// Archive/Unarchive conversation for a user
export const toggleArchiveConversation = async (myUid, partnerUid, shouldArchive) => {
    const userRef = doc(db, "users", myUid);
    await updateDoc(userRef, {
        archivedChats: shouldArchive ? arrayUnion(partnerUid) : arrayRemove(partnerUid),
    });
};

// Upload user profile photo
export const uploadProfilePhoto = async (uid, file) => {
    const storageRef = ref(storage, `profiles/${uid}_avatar`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

// Listen to all users list in real time
export const listenToUsers = (callback) => {
    const q = query(collection(db, "users"), orderBy("displayName", "asc"));
    return onSnapshot(
        q,
        (snapshot) => {
            const users = [];
            snapshot.forEach((doc) => {
                users.push(doc.data());
            });
            callback(users);
        },
        (error) => {
            console.error("Error listening to users:", error);
        }
    );
};

// Listen to last message in a conversation in real time
export const listenToLastMessage = (myUid, partnerUid, callback) => {
    const conversationId = getConversationId(myUid, partnerUid);
    const q = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        orderBy("createdAt", "desc"),
        limit(1)
    );

    return onSnapshot(
        q,
        (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                callback({ id: doc.id, ...doc.data() });
            } else {
                callback(null);
            }
        },
        (error) => {
            console.error("Error listening to last message:", error);
        }
    );
};

// Listen to unread message count in a conversation
export const listenToUnreadCount = (myUid, partnerUid, callback) => {
    const conversationId = getConversationId(myUid, partnerUid);
    const q = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        where("receiverId", "==", myUid),
        where("status", "!=", "read")
    );

    return onSnapshot(
        q,
        (snapshot) => {
            callback(snapshot.size);
        },
        (error) => {
            console.error("Error listening to unread count:", error);
        }
    );
};
