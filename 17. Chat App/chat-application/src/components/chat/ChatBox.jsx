import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
    sendMessage,
    setTypingStatus,
    listenToTypingStatus,
    markMessagesAsRead,
} from "../../services/chatService";
import { formatLastSeen } from "../../utils/helpers";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

function ChatBox({ activePartner, onBack }) {
    const { user } = useAuth();
    const [partnerTyping, setPartnerTyping] = useState(false);
    
    // Search message keyword query
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");

    // Message reply reference state
    const [replyTo, setReplyTo] = useState(null);

    // Upload attachment states
    const [attachedFile, setAttachedFile] = useState(null);
    const [filePreview, setFilePreview] = useState("");

    // Zoom Image Preview state
    const [zoomImageSrc, setZoomImageSrc] = useState(null);

    // Track total messages to play notification alert sounds on arrivals
    const [messageCount, setMessageCount] = useState(0);
    const isFirstLoad = useRef(true);

    // Play synthetic chime sound
    const playNotificationSound = () => {
        try {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtxClass) return;
            const audioCtx = new AudioCtxClass();
            if (audioCtx.state === "suspended") return;

            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = "sine";
            const now = audioCtx.currentTime;
            oscillator.frequency.setValueAtTime(698.46, now); // F5
            oscillator.frequency.setValueAtTime(880.00, now + 0.1); // A5
            
            gainNode.gain.setValueAtTime(0.08, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            oscillator.start(now);
            oscillator.stop(now + 0.3);
        } catch (e) {
            console.warn("Autoplay block or audio initialization failed:", e);
        }
    };

    // Mark messages read on selecting a conversation
    useEffect(() => {
        if (!activePartner?.uid || !user?.uid) return;
        markMessagesAsRead(user.uid, activePartner.uid);
        
        // Reset states
        setReplyTo(null);
        setAttachedFile(null);
        setFilePreview("");
        setSearchText("");
        setShowSearch(false);
        isFirstLoad.current = true;
    }, [activePartner, user]);

    // Listen to typing status
    useEffect(() => {
        if (!activePartner?.uid || !user?.uid) return;

        const unsubscribe = listenToTypingStatus(user.uid, activePartner.uid, (isTyping) => {
            setPartnerTyping(isTyping);
        });

        return () => {
            unsubscribe();
            setTypingStatus(user.uid, activePartner.uid, false);
        };
    }, [activePartner, user]);

    // Send message submit trigger
    const handleSendMessage = async (text) => {
        if (!activePartner || (!text.trim() && !attachedFile)) return;

        try {
            await setTypingStatus(user.uid, activePartner.uid, false);
            await sendMessage({
                senderId: user.uid,
                senderName: user.displayName || user.email.split("@")[0],
                receiverId: activePartner.uid,
                text,
                imageFile: attachedFile,
                replyTo,
            });

            // Clear inputs
            setAttachedFile(null);
            setFilePreview("");
            setReplyTo(null);
        } catch (err) {
            alert(err.message || "Failed to send message.");
        }
    };

    const handleAttachFile = (file) => {
        if (file) {
            setAttachedFile(file);
            setFilePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveFilePreview = () => {
        setAttachedFile(null);
        setFilePreview("");
    };

    const handleMessagesUpdate = (messages) => {
        if (!activePartner) return;

        const count = messages.length;
        if (count > messageCount) {
            const lastMsg = messages[messages.length - 1];
            if (!isFirstLoad.current && lastMsg && lastMsg.senderId === activePartner.uid) {
                playNotificationSound();
                markMessagesAsRead(user.uid, activePartner.uid);
            }
        }
        setMessageCount(count);
        isFirstLoad.current = false;
    };

    if (!activePartner) {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    color: "var(--wa-text-muted)",
                    backgroundColor: "var(--wa-search-bg)",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ color: "var(--wa-text)", fontWeight: "400", fontSize: "28px", margin: "0 0 10px 0" }}>
                        WhatsApp for Web
                    </h3>
                    <p style={{ margin: 0, fontSize: "14px" }}>
                        Select a contact in the sidebar list to start chatting.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "var(--wa-bg-light)",
                position: "relative",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "10px 20px",
                    borderBottom: "1px solid var(--wa-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#fff",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Back Button for mobile view */}
                    <button
                        onClick={onBack}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "20px",
                            padding: "4px",
                            display: window.innerWidth <= 768 ? "block" : "none",
                        }}
                    >
                        ⬅
                    </button>

                    <img
                        src={activePartner.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
                        alt="Avatar"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />

                    <div>
                        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "500", color: "var(--wa-text)" }}>
                            {activePartner.displayName}
                        </h4>
                        <span style={{ fontSize: "12px", color: activePartner.online ? "var(--wa-green)" : "var(--wa-text-muted)" }}>
                            {activePartner.online ? "online" : `last seen ${formatLastSeen(activePartner.lastSeen)}`}
                        </span>
                    </div>
                </div>

                {/* Message Search box */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="Search messages"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{
                                padding: "6px 10px",
                                border: "1px solid var(--wa-border)",
                                borderRadius: "6px",
                                fontSize: "13px",
                                outline: "none",
                                backgroundColor: "var(--wa-search-bg)",
                            }}
                        />
                    )}
                    <button
                        onClick={() => {
                            setShowSearch(!showSearch);
                            setSearchText("");
                        }}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "var(--wa-text-muted)",
                            padding: "6px",
                            borderRadius: "50%",
                        }}
                        title="Search messages"
                    >
                        🔍
                    </button>
                </div>
            </div>

            {/* Messages Scroll Panel */}
            <MessageList
                myUid={user.uid}
                partnerUid={activePartner.uid}
                searchText={searchText}
                onReplySelect={(msg) => setReplyTo(msg)}
                onImageSelect={(src) => setZoomImageSrc(src)}
                onMessagesChange={handleMessagesUpdate}
            />

            {/* Typing status bar */}
            {partnerTyping && (
                <div style={{ padding: "4px 20px", fontSize: "13px", color: "var(--wa-green)", fontStyle: "italic", backgroundColor: "rgba(255,255,255,0.7)" }}>
                    {activePartner.displayName} is typing...
                </div>
            )}

            {/* Reply Preview Bar */}
            {replyTo && (
                <div
                    style={{
                        padding: "8px 20px",
                        backgroundColor: "#f0f2f5",
                        borderTop: "1px solid var(--wa-border)",
                        borderLeft: "4px solid var(--wa-green)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div style={{ fontSize: "13px" }}>
                        <span style={{ fontWeight: "bold", color: "var(--wa-green-dark)" }}>Reply to {replyTo.senderName}: </span>
                        <span style={{ color: "var(--wa-text-muted)" }}>{replyTo.image ? "📷 Image" : replyTo.text}</span>
                    </div>
                    <button
                        onClick={() => setReplyTo(null)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "var(--wa-text-muted)" }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Image Preview attachment row */}
            {filePreview && (
                <div
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#f0f2f5",
                        borderTop: "1px solid var(--wa-border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <div style={{ position: "relative" }}>
                        <img
                            src={filePreview}
                            alt="Attach preview"
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--wa-border)" }}
                        />
                        <button
                            onClick={handleRemoveFilePreview}
                            style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-6px",
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "16px",
                                height: "16px",
                                fontSize: "10px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            ✕
                        </button>
                    </div>
                    <span style={{ fontSize: "13px", color: "var(--wa-text-muted)" }}>Image ready to send.</span>
                </div>
            )}

            {/* Input Bar */}
            <ChatInput
                onSendMessage={handleSendMessage}
                onAttachFile={handleAttachFile}
                partnerUid={activePartner.uid}
            />

            {/* Zoom Image Overlay Modal */}
            {zoomImageSrc && (
                <div
                    onClick={() => setZoomImageSrc(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.85)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
                        <img
                            src={zoomImageSrc}
                            alt="Preview"
                            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "4px" }}
                        />
                        <div style={{ textAlign: "center", marginTop: "15px" }}>
                            <a
                                href={zoomImageSrc}
                                download="shared_image.jpg"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    backgroundColor: "var(--wa-green)",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "4px",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                            >
                                Download Image
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatBox;