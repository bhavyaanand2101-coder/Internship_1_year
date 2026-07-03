import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { togglePinConversation, toggleArchiveConversation } from "../../services/chatService";
import { formatMessageTime } from "../../utils/helpers";
import { toast } from "react-hot-toast";
import { 
    MdPushPin, 
    MdOutlinePushPin, 
    MdArchive, 
    MdUnarchive 
} from "react-icons/md";
import { BsCheck, BsCheckAll } from "react-icons/bs";

function UserCard({
    otherUser,
    active,
    lastMessage,
    unreadCount,
    isPinned,
    isArchived,
    isTyping,
    onClick,
}) {
    const { user } = useAuth();
    const [hovered, setHovered] = useState(false);

    // Toggle Pin status
    const handlePin = async (e) => {
        e.stopPropagation();
        try {
            await togglePinConversation(user.uid, otherUser.uid, !isPinned);
            toast.success(isPinned ? "Chat unpinned" : "Chat pinned");
        } catch (err) {
            toast.error("Failed to pin: " + err.message);
        }
    };

    // Toggle Archive status
    const handleArchive = async (e) => {
        e.stopPropagation();
        try {
            await toggleArchiveConversation(user.uid, otherUser.uid, !isArchived);
            toast.success(isArchived ? "Chat unarchived" : "Chat archived");
        } catch (err) {
            toast.error("Failed to archive: " + err.message);
        }
    };

    // Message status ticks
    const renderTicks = () => {
        if (!lastMessage || lastMessage.senderId !== user.uid || lastMessage.deleted) return null;
        
        if (lastMessage.status === "read") {
            return <BsCheckAll style={{ color: "#53bdeb", fontSize: "16px", marginRight: "3px" }} />;
        }
        return <BsCheck style={{ color: "var(--color-text-muted)", fontSize: "16px", marginRight: "3px" }} />;
    };

    // Message snippet text
    const renderSnippet = () => {
        if (isTyping) {
            return (
                <span style={{ color: "var(--color-accent)", fontWeight: "600", display: "flex", alignItems: "center", gap: "2px" }}>
                    typing
                    <span className="typing-indicator-dot"></span>
                    <span className="typing-indicator-dot"></span>
                    <span className="typing-indicator-dot"></span>
                </span>
            );
        }

        if (!lastMessage) {
            return (
                <span style={{ fontStyle: "italic", color: "var(--color-text-muted)" }}>
                    No messages
                </span>
            );
        }

        if (lastMessage.deleted) {
            return (
                <span style={{ fontStyle: "italic", color: "var(--color-text-muted)" }}>
                    🚫 Message deleted
                </span>
            );
        }

        const prefix = lastMessage.senderId === user.uid ? "" : "";
        
        if (lastMessage.image) {
            return (
                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-text-muted)" }}>
                    {renderTicks()}
                    📷 Image
                </span>
            );
        }

        if (lastMessage.mediaType === "audio" || lastMessage.audio) {
            return (
                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-text-muted)" }}>
                    {renderTicks()}
                    🎙️ Voice Note
                </span>
            );
        }

        return (
            <span style={{ display: "flex", alignItems: "center", color: "var(--color-text-muted)" }}>
                {renderTicks()}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {prefix}{lastMessage.text}
                </span>
            </span>
        );
    };

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: "1px solid var(--color-border)",
                backgroundColor: active ? "var(--bg-active)" : hovered ? "var(--bg-hover)" : "transparent",
                transition: "background-color 0.2s ease, transform 0.1s ease",
                position: "relative",
                userSelect: "none",
            }}
        >
            {/* Avatar thumbnail container */}
            <div style={{ position: "relative", marginRight: "12px", flexShrink: 0 }}>
                <img
                    src={otherUser.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
                    alt={otherUser.displayName}
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        backgroundColor: "var(--bg-app)",
                        border: "1px solid var(--color-border)",
                    }}
                />
                
                {/* Active online green status indicator */}
                {otherUser.online && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "2px",
                            right: "2px",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "var(--color-online)",
                            border: "2.5px solid var(--bg-sidebar)",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        }}
                    ></div>
                )}
            </div>

            {/* Content area */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
                
                {/* Contact Name & Time */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h4
                        style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: "500",
                            color: "var(--color-text)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {otherUser.displayName}
                    </h4>
                    {lastMessage?.createdAt && (
                        <span
                            style={{
                                fontSize: "11px",
                                color: unreadCount > 0 ? "var(--color-accent)" : "var(--color-text-muted)",
                                fontWeight: unreadCount > 0 ? "600" : "400",
                                marginLeft: "6px",
                            }}
                        >
                            {formatMessageTime(lastMessage.createdAt)}
                        </span>
                    )}
                </div>

                {/* Last Message Snippet / Typing Indicator & Icons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: 0, fontSize: "13px", height: "18px", overflow: "hidden" }}>
                        {renderSnippet()}
                    </div>

                    {/* Metadata status symbols */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, marginLeft: "8px", height: "20px" }}>
                        {isPinned && !hovered && (
                            <MdPushPin style={{ color: "var(--color-text-muted)", transform: "rotate(45deg)", fontSize: "14px" }} />
                        )}
                        {unreadCount > 0 && (
                            <span
                                style={{
                                    backgroundColor: "var(--color-accent)",
                                    color: "#ffffff",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    borderRadius: "10px",
                                    minWidth: "18px",
                                    height: "18px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0 5px",
                                    boxShadow: "0 1px 2px rgba(0, 168, 132, 0.2)",
                                }}
                            >
                                {unreadCount}
                            </span>
                        )}

                        {/* Quick action buttons appearing ONLY on hover */}
                        {hovered && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    animation: "fadeIn 0.15s ease",
                                }}
                            >
                                <button
                                    onClick={handlePin}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "3px",
                                        color: "var(--color-text-muted)",
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                    }}
                                    title={isPinned ? "Unpin Chat" : "Pin Chat"}
                                >
                                    {isPinned ? (
                                        <MdPushPin style={{ color: "var(--color-accent)", transform: "rotate(45deg)" }} />
                                    ) : (
                                        <MdOutlinePushPin style={{ fontSize: "16px" }} />
                                    )}
                                </button>
                                
                                <button
                                    onClick={handleArchive}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "3px",
                                        color: "var(--color-text-muted)",
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                    }}
                                    title={isArchived ? "Unarchive Chat" : "Archive Chat"}
                                >
                                    {isArchived ? (
                                        <MdUnarchive style={{ color: "var(--color-accent)" }} />
                                    ) : (
                                        <MdArchive style={{ fontSize: "16px" }} />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserCard;