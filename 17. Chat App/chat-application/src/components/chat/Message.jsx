import { useState, useRef, useEffect } from "react";
import { editMessage, deleteMessage } from "../../services/chatService";
import { formatMessageTime } from "../../utils/helpers";
import { toast } from "react-hot-toast";
import { 
    MdPlayArrow, 
    MdPause, 
    MdEdit, 
    MdDelete, 
    MdReply, 
    MdCheck 
} from "react-icons/md";
import { BsCheck, BsCheckAll } from "react-icons/bs";

// Custom Audio Player Sub-component
function VoiceMessagePlayer({ audioUrl }) {
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.warn(e));
        }
        setPlaying(!playing);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleAudioEnded = () => {
        setPlaying(false);
        setCurrentTime(0);
    };

    const handleProgressClick = (e) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        const nextTime = percentage * duration;
        audioRef.current.currentTime = nextTime;
        setCurrentTime(nextTime);
    };

    const formatTime = (timeSecs) => {
        if (isNaN(timeSecs)) return "0:00";
        const mins = Math.floor(timeSecs / 60);
        const secs = Math.floor(timeSecs % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="audio-player-container">
            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleAudioEnded}
                preload="metadata"
            />
            <button type="button" onClick={togglePlay} className="audio-controls">
                {playing ? <MdPause size={20} /> : <MdPlayArrow size={20} />}
            </button>
            <div onClick={handleProgressClick} className="audio-progress-bar">
                <div 
                    className="audio-progress-filled" 
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
            </div>
            <span className="audio-time-label">
                {playing ? formatTime(currentTime) : formatTime(duration)}
            </span>
        </div>
    );
}

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
                        backgroundColor: "#facc15",
                        color: "#000000",
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
            toast.success("Message edited");
        } catch (err) {
            toast.error("Failed to edit message.");
        } finally {
            setLoading(false);
        }
    };

    // Soft delete message text
    const handleDelete = async () => {
        if (window.confirm("Delete this message?")) {
            try {
                await deleteMessage(message.id);
                toast.success("Message deleted");
            } catch (err) {
                toast.error("Failed to delete message.");
            }
        }
    };

    const renderStatusTicks = () => {
        if (!isMe || message.deleted) return null;
        if (message.status === "read") {
            return <BsCheckAll style={{ color: "#53bdeb", fontSize: "16px", marginLeft: "4px" }} />;
        }
        return <BsCheck style={{ color: "var(--color-text-muted)", fontSize: "16px", marginLeft: "4px" }} />;
    };

    return (
        <div
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "4px",
                width: "100%",
                padding: "0 8px",
            }}
        >
            <div
                className={`chat-bubble ${isMe ? "sender" : "receiver"}`}
                style={{
                    color: "var(--color-text)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Sender Name for incoming messages */}
                {!isMe && !message.deleted && (
                    <span 
                        style={{ 
                            fontSize: "12px", 
                            fontWeight: "600", 
                            color: "var(--color-accent-dark)", 
                            marginBottom: "4px",
                            display: "block" 
                        }}
                    >
                        {message.senderName}
                    </span>
                )}

                {/* Reply context reference */}
                {message.replyTo && !message.deleted && (
                    <div
                        style={{
                            background: "rgba(0,0,0,0.05)",
                            padding: "6px 10px",
                            borderLeft: "3.5px solid var(--color-accent)",
                            borderRadius: "4px",
                            marginBottom: "6px",
                            fontSize: "11.5px",
                        }}
                    >
                        <div style={{ fontWeight: "600", color: "var(--color-accent-dark)" }}>{message.replyTo.senderName}</div>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-text-muted)" }}>
                            {message.replyTo.image ? "📷 Image" : message.replyTo.text}
                        </div>
                    </div>
                )}

                {/* Image message */}
                {message.image && !message.deleted && (
                    <div style={{ position: "relative", marginBottom: "4px" }}>
                        <img
                            src={message.image}
                            alt="Shared media"
                            onClick={onImageClick}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "240px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                objectFit: "cover",
                                border: "1px solid var(--color-border)",
                            }}
                        />
                    </div>
                )}

                {/* Custom Audio Player for voice notes */}
                {(message.mediaType === "audio" || message.audio) && !message.deleted && (
                    <VoiceMessagePlayer audioUrl={message.audio || message.text} />
                )}

                {/* Text editor or display content */}
                {isEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px", minWidth: "200px" }}>
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            style={{
                                width: "100%",
                                minHeight: "50px",
                                boxSizing: "border-box",
                                padding: "8px",
                                fontSize: "13.5px",
                                border: "1px solid var(--color-border)",
                                borderRadius: "6px",
                                outline: "none",
                                backgroundColor: "var(--bg-panel)",
                                color: "var(--color-text)",
                            }}
                            disabled={loading}
                        />
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button 
                                onClick={() => setIsEditing(false)} 
                                disabled={loading} 
                                style={{ fontSize: "11px", cursor: "pointer", border: "none", background: "none", color: "var(--color-text-muted)" }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave} 
                                disabled={loading} 
                                style={{ fontSize: "11px", cursor: "pointer", border: "none", background: "none", fontWeight: "600", color: "var(--color-accent)" }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    // Regular text message body
                    !(message.mediaType === "audio" || message.audio) && (
                        <div style={{ fontSize: "14px", wordBreak: "break-word", whiteSpace: "pre-wrap", paddingRight: "40px", marginBottom: "4px" }}>
                            {message.deleted ? (
                                <span style={{ fontStyle: "italic", opacity: 0.65 }}>🚫 This message was deleted</span>
                            ) : (
                                highlightText(message.text || "", searchText)
                            )}
                        </div>
                    )
                )}

                {/* Bubble Footer details */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "2px",
                        fontSize: "10px",
                        color: "var(--color-text-muted)",
                        marginTop: "2px",
                        alignSelf: "flex-end",
                    }}
                >
                    {message.edited && !message.deleted && <span style={{ fontStyle: "italic", marginRight: "3px" }}>edited</span>}
                    <span>
                        {message.createdAt ? formatMessageTime(message.createdAt) : "Sending..."}
                    </span>
                    {renderStatusTicks()}
                </div>

                {/* Small inline hover options */}
                {showActions && !message.deleted && !isEditing && (
                    <div
                        className="animate-fade-in"
                        style={{
                            position: "absolute",
                            top: "-26px",
                            right: isMe ? "0" : "auto",
                            left: isMe ? "auto" : "0",
                            backgroundColor: "var(--bg-panel)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "6px",
                            display: "flex",
                            gap: "8px",
                            padding: "3px 8px",
                            zIndex: 10,
                            boxShadow: "0 2px 8px var(--color-shadow)",
                        }}
                    >
                        <button 
                            onClick={onReply} 
                            style={{ background: "none", border: "none", fontSize: "11px", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "2px" }}
                        >
                            <MdReply /> Reply
                        </button>
                        {isMe && (
                            <>
                                <button 
                                    onClick={() => setIsEditing(true)} 
                                    style={{ background: "none", border: "none", fontSize: "11px", cursor: "pointer", color: "var(--color-text-muted)" }}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={handleDelete} 
                                    style={{ background: "none", border: "none", fontSize: "11px", cursor: "pointer", color: "var(--color-text-muted)" }}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Message;