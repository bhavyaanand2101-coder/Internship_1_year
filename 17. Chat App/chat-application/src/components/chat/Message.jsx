import { useState } from "react";
import { editMessage, deleteMessage } from "../../services/chatService";
import { formatMessageTime } from "../../utils/helpers";

function Message({ message, isMe, searchText, onReply, onImageClick }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.text || "");
    const [loading, setLoading] = useState(false);
    const [showActions, setShowActions] = useState(false);

    // Search query highlight
    const highlightText = (text, highlight) => {
        if (!highlight || !highlight.trim()) return text;
        const parts = text.split(new RegExp(`(${highlight})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <mark
                    key={index}
                    style={{
                        backgroundColor: "#ffe066",
                        color: "black",
                        padding: "0 2px",
                        borderRadius: "2px",
                    }}
                >
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    // Update message text
    const handleSave = async () => {
        if (!editText.trim() || editText.trim() === message.text) {
            setIsEditing(false);
            return;
        }

        try {
            setLoading(true);
            await editMessage(message.id, editText);
            setIsEditing(false);
        } catch (err) {
            alert("Failed to edit message.");
        } finally {
            setLoading(false);
        }
    };

    // Soft delete message text
    const handleDelete = async () => {
        if (window.confirm("Delete this message?")) {
            try {
                await deleteMessage(message.id);
            } catch (err) {
                alert("Failed to delete message.");
            }
        }
    };

    return (
        <div
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "8px",
                width: "100%",
            }}
        >
            <div
                style={{
                    backgroundColor: isMe ? "var(--wa-bubble-out)" : "var(--wa-bubble-in)",
                    color: "var(--wa-text)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    maxWidth: "65%",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.12)",
                    boxSizing: "border-box",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Sender Name for incoming messages */}
                {!isMe && !message.deleted && (
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--wa-green-dark)", marginBottom: "4px" }}>
                        {message.senderName}
                    </span>
                )}

                {/* Reply context reference */}
                {message.replyTo && !message.deleted && (
                    <div
                        style={{
                            background: "rgba(0,0,0,0.04)",
                            padding: "6px 8px",
                            borderLeft: "3.5px solid var(--wa-green)",
                            borderRadius: "4px",
                            marginBottom: "6px",
                            fontSize: "12px",
                        }}
                    >
                        <div style={{ fontWeight: "bold", color: "var(--wa-green-dark)" }}>{message.replyTo.senderName}</div>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--wa-text-muted)" }}>
                            {message.replyTo.image ? "📷 Image" : message.replyTo.text}
                        </div>
                    </div>
                )}

                {/* Image message */}
                {message.image && !message.deleted && (
                    <img
                        src={message.image}
                        alt="Shared image"
                        onClick={onImageClick}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "220px",
                            borderRadius: "4px",
                            marginBottom: "4px",
                            cursor: "pointer",
                        }}
                    />
                )}

                {/* Text editor or display content */}
                {isEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            style={{
                                width: "100%",
                                minHeight: "50px",
                                boxSizing: "border-box",
                                padding: "6px",
                                fontSize: "14px",
                                border: "1px solid var(--wa-border)",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                            disabled={loading}
                        />
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                            <button onClick={() => setIsEditing(false)} disabled={loading} style={{ fontSize: "11px", cursor: "pointer", border: "none", background: "none" }}>Cancel</button>
                            <button onClick={handleSave} disabled={loading} style={{ fontSize: "11px", cursor: "pointer", border: "none", background: "none", fontWeight: "bold", color: "var(--wa-green)" }}>Save</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ fontSize: "14.2px", wordBreak: "break-word", whiteSpace: "pre-wrap", paddingRight: "30px" }}>
                        {message.deleted ? (
                            <span style={{ fontStyle: "italic", opacity: 0.6 }}>{message.text}</span>
                        ) : (
                            highlightText(message.text || "", searchText)
                        )}
                    </div>
                )}

                {/* Bubble Footer details */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "10px",
                        color: "var(--wa-text-muted)",
                        marginTop: "2px",
                        alignSelf: "flex-end",
                        position: "absolute",
                        bottom: "4px",
                        right: "8px",
                    }}
                >
                    {message.edited && !message.deleted && <span style={{ fontStyle: "italic" }}>edited</span>}
                    <span>
                        {message.createdAt ? formatMessageTime(message.createdAt) : "Sending..."}
                    </span>
                    {isMe && !message.deleted && (
                        <span style={{ fontSize: "11px", color: message.status === "read" ? "#53bdeb" : "inherit" }}>
                            {message.status === "read" ? "✓✓" : "✓"}
                        </span>
                    )}
                </div>

                {/* Small inline hover options */}
                {showActions && !message.deleted && !isEditing && (
                    <div
                        style={{
                            position: "absolute",
                            top: "-22px",
                            right: isMe ? "0" : "auto",
                            left: isMe ? "auto" : "0",
                            backgroundColor: "#fff",
                            border: "1px solid var(--wa-border)",
                            borderRadius: "4px",
                            display: "flex",
                            gap: "4px",
                            padding: "2px 6px",
                            zIndex: 10,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                    >
                        <button onClick={onReply} style={{ background: "none", border: "none", fontSize: "11px", cursor: "pointer", color: "var(--wa-text-muted)" }}>Reply</button>
                        {isMe && (
                            <>
                                <button onClick={() => setIsEditing(true)} style={{ background: "none", border: "none", fontSize: "11px", cursor: "pointer", color: "var(--wa-text-muted)" }}>Edit</button>
                                <button onClick={handleDelete} style={{ background: "none", border: "none", fontSize: "11px", cursor: "pointer", color: "var(--wa-text-muted)" }}>Delete</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Message;