import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { setTypingStatus } from "../../services/chatService";

const QUICK_EMOJIS = ["👋", "😂", "👍", "❤️", "🔥", "🎉", "😮", "😢", "🤔", "🙏"];

function ChatInput({ onSendMessage, onAttachFile, partnerUid }) {
    const { user } = useAuth();
    const [text, setText] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Typing activity timer
    const handleChange = (e) => {
        const val = e.target.value;
        setText(val);

        if (!user?.uid || !partnerUid) return;

        setTypingStatus(user.uid, partnerUid, true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setTypingStatus(user.uid, partnerUid, false);
        }, 2000);
    };

    // Submit send message
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!text.trim()) return;

        onSendMessage(text);
        setText("");
        setShowEmojis(false);
        inputRef.current?.focus();

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        setTypingStatus(user.uid, partnerUid, false);
    };

    const handleEmojiClick = (emoji) => {
        setText((prev) => prev + emoji);
        inputRef.current?.focus();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            onAttachFile(file);
        }
    };

    // Drag and Drop files
    useEffect(() => {
        const handleDragOver = (e) => {
            e.preventDefault();
            setIsDragging(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            setIsDragging(false);
        };

        const handleDrop = (e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer?.files?.[0];
            if (file && file.type.startsWith("image/")) {
                onAttachFile(file);
            }
        };

        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("drop", handleDrop);

        return () => {
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("drop", handleDrop);
        };
    }, [onAttachFile]);

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                padding: "10px 16px",
                borderTop: "1px solid var(--wa-border)",
                display: "flex",
                gap: "12px",
                alignItems: "center",
                backgroundColor: "#f0f2f5",
                position: "relative",
            }}
        >
            {/* Drag drop area overlay */}
            {isDragging && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,128,105,0.08)",
                        border: "2px dashed var(--wa-green)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "var(--wa-green-dark)",
                        fontWeight: "bold",
                        zIndex: 10,
                        pointerEvents: "none",
                    }}
                >
                    Drop image here to attach
                </div>
            )}

            {/* Emoji popup button */}
            <button
                type="button"
                onClick={() => setShowEmojis(!showEmojis)}
                style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    padding: "4px",
                    color: "var(--wa-text-muted)",
                }}
                title="Emojis"
            >
                😊
            </button>

            {/* Simple Emojis list */}
            {showEmojis && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "65px",
                        left: "16px",
                        backgroundColor: "#fff",
                        border: "1px solid var(--wa-border)",
                        borderRadius: "8px",
                        padding: "8px",
                        display: "flex",
                        gap: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.12)",
                        zIndex: 100,
                    }}
                >
                    {QUICK_EMOJIS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => handleEmojiClick(emoji)}
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "18px",
                                cursor: "pointer",
                                padding: "2px",
                            }}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Attach Image button */}
            <label
                style={{
                    fontSize: "20px",
                    cursor: "pointer",
                    padding: "4px",
                    color: "var(--wa-text-muted)",
                }}
                title="Attach Image"
            >
                📎
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                />
            </label>

            {/* Rounded Input Text Field */}
            <input
                ref={inputRef}
                type="text"
                placeholder="Type a message"
                value={text}
                onChange={handleChange}
                style={{
                    flex: 1,
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "20px",
                    fontSize: "14.5px",
                    boxSizing: "border-box",
                    backgroundColor: "#ffffff",
                    color: "var(--wa-text)",
                    outline: "none",
                }}
            />

            {/* Circular Green Send button */}
            <button
                type="submit"
                style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    backgroundColor: "var(--wa-green)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                }}
                title="Send"
            >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
            </button>
        </form>
    );
}

export default ChatInput;