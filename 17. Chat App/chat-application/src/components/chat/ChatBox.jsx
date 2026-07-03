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
import CallingModal from "./CallingModal";
import { toast } from "react-hot-toast";
import { 
    MdArrowBack, 
    MdSearch, 
    MdVideocam, 
    MdCall, 
    MdMoreVert, 
    MdClose 
} from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";

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

    // Simulated calling states
    const [callingType, setCallingType] = useState(null); // 'voice', 'video', or null

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
        setCallingType(null);
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
    const handleSendMessage = async (text, audioFile = null) => {
        if (!activePartner || (!text.trim() && !attachedFile && !audioFile)) return;

        try {
            await setTypingStatus(user.uid, activePartner.uid, false);
            await sendMessage({
                senderId: user.uid,
                senderName: user.displayName || user.email.split("@")[0],
                receiverId: activePartner.uid,
                text,
                imageFile: attachedFile,
                audioFile: audioFile,
                replyTo,
            });

            // Clear inputs
            setAttachedFile(null);
            setFilePreview("");
            setReplyTo(null);
        } catch (err) {
            toast.error(err.message || "Failed to send message.");
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
                    color: "var(--color-text-muted)",
                    backgroundColor: "var(--bg-app)",
                    textAlign: "center",
                    padding: "24px",
                    transition: "all var(--transition-speed)",
                }}
            >
                <div 
                    className="glass-panel animate-fade-in"
                    style={{
                        padding: "40px 30px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px var(--color-shadow)",
                        maxWidth: "460px",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <div 
                        style={{ 
                            width: "72px", 
                            height: "72px", 
                            borderRadius: "50%", 
                            backgroundColor: "rgba(0,168,132,0.08)", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            margin: "0 auto 20px auto"
                        }}
                    >
                        <IoChatbubblesOutline style={{ fontSize: "36px", color: "var(--color-accent)" }} />
                    </div>
                    <h3 style={{ color: "var(--color-text)", fontWeight: "600", fontSize: "24px", margin: "0 0 12px 0" }}>
                        WaveChat Web App
                    </h3>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
                        Select a contact card from the list or search for users in the sidebar to start exchanging real-time messages.
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
                backgroundColor: "var(--bg-chat-body)",
                position: "relative",
                transition: "all var(--transition-speed)",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "var(--bg-chat-header)",
                    height: "60px",
                    zIndex: 10,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    {/* Back Button for mobile view */}
                    <button
                        onClick={onBack}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "20px",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--color-text-muted)",
                            marginRight: "4px",
                        }}
                    >
                        <MdArrowBack />
                    </button>

                    <img
                        src={activePartner.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
                        alt={activePartner.displayName}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            backgroundColor: "var(--bg-panel)",
                            border: "1px solid var(--color-border)",
                        }}
                    />

                    <div style={{ minWidth: 0 }}>
                        <h4 
                            style={{ 
                                margin: 0, 
                                fontSize: "15px", 
                                fontWeight: "500", 
                                color: "var(--color-text)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}
                        >
                            {activePartner.displayName}
                        </h4>
                        <span 
                            style={{ 
                                fontSize: "11.5px", 
                                color: partnerTyping ? "var(--color-accent)" : "var(--color-text-muted)",
                                fontWeight: partnerTyping ? "600" : "400"
                            }}
                        >
                            {partnerTyping 
                                ? "typing..." 
                                : activePartner.online 
                                    ? "online" 
                                    : `last seen ${formatLastSeen(activePartner.lastSeen)}`
                            }
                        </span>
                    </div>
                </div>

                {/* Header Action Menu icons */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                    <button
                        onClick={() => setCallingType("voice")}
                        style={{ background: "none", border: "none", color: "var(--color-text-muted)", fontSize: "20px", padding: "4px" }}
                        title="Simulate Voice Call"
                    >
                        <MdCall />
                    </button>

                    <button
                        onClick={() => setCallingType("video")}
                        style={{ background: "none", border: "none", color: "var(--color-text-muted)", fontSize: "22px", padding: "4px" }}
                        title="Simulate Video Call"
                    >
                        <MdVideocam />
                    </button>

                    <button
                        onClick={() => {
                            setShowSearch(!showSearch);
                            setSearchText("");
                        }}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "20px",
                            color: showSearch ? "var(--color-accent)" : "var(--color-text-muted)",
                            padding: "4px",
                        }}
                        title="Search messages"
                    >
                        <MdSearch />
                    </button>

                    <button
                        style={{ background: "none", border: "none", color: "var(--color-text-muted)", fontSize: "20px", padding: "4px" }}
                    >
                        <MdMoreVert />
                    </button>
                </div>
            </div>

            {/* Inline Keyword message search panel */}
            {showSearch && (
                <div
                    className="animate-fade-in"
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "var(--bg-chat-header)",
                        borderBottom: "1px solid var(--color-border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        zIndex: 5,
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search text in messages..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="custom-input"
                        style={{
                            flex: 1,
                            padding: "6px 12px",
                            fontSize: "13px",
                            height: "32px",
                        }}
                        autoFocus
                    />
                    <button
                        onClick={() => {
                            setShowSearch(false);
                            setSearchText("");
                        }}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "18px",
                            color: "var(--color-text-muted)",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <MdClose />
                    </button>
                </div>
            )}

            {/* Messages Area Panel */}
            <div className="chat-wallpaper-doodle" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <MessageList
                    myUid={user.uid}
                    partnerUid={activePartner.uid}
                    searchText={searchText}
                    onReplySelect={(msg) => setReplyTo(msg)}
                    onImageSelect={(src) => setZoomImageSrc(src)}
                    onMessagesChange={handleMessagesUpdate}
                />
            </div>

            {/* Reply Context Reference Banner */}
            {replyTo && (
                <div
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "var(--bg-chat-header)",
                        borderTop: "1px solid var(--color-border)",
                        borderLeft: "4px solid var(--color-accent)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div style={{ fontSize: "13px", minWidth: 0 }}>
                        <span style={{ fontWeight: "600", color: "var(--color-accent)" }}>Reply to {replyTo.senderName}: </span>
                        <span style={{ color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", maxWidth: "250px", verticalAlign: "middle" }}>
                            {replyTo.image ? "📷 Image" : replyTo.text}
                        </span>
                    </div>
                    <button
                        onClick={() => setReplyTo(null)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "var(--color-text-muted)", display: "flex" }}
                    >
                        <MdClose />
                    </button>
                </div>
            )}

            {/* Attachment File Preview Area */}
            {filePreview && (
                <div
                    style={{
                        padding: "10px 16px",
                        backgroundColor: "var(--bg-chat-header)",
                        borderTop: "1px solid var(--color-border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <div style={{ position: "relative", width: "50px", height: "50px" }}>
                        <img
                            src={filePreview}
                            alt="Attach Preview"
                            style={{ 
                                width: "100%", 
                                height: "100%", 
                                objectFit: "cover", 
                                borderRadius: "6px", 
                                border: "1px solid var(--color-border)" 
                            }}
                        />
                        <button
                            onClick={handleRemoveFilePreview}
                            style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-6px",
                                background: "#ef4444",
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
                                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                            }}
                        >
                            ✕
                        </button>
                    </div>
                    <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>Image ready to send.</span>
                </div>
            )}

            {/* Input Controller Area */}
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
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                        <img
                            src={zoomImageSrc}
                            alt="Zoom Shared"
                            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                        />
                        <div style={{ textAlign: "center", marginTop: "16px" }}>
                            <a
                                href={zoomImageSrc}
                                download="shared_image.jpg"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    backgroundColor: "var(--color-accent)",
                                    color: "white",
                                    padding: "8px 20px",
                                    borderRadius: "20px",
                                    textDecoration: "none",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    boxShadow: "0 4px 12px rgba(0, 168, 132, 0.3)",
                                }}
                            >
                                Download Original
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Calling simulated Overlay modal */}
            {callingType && (
                <CallingModal
                    partner={activePartner}
                    isVideo={callingType === "video"}
                    onClose={() => setCallingType(null)}
                />
            )}
        </div>
    );
}

export default ChatBox;