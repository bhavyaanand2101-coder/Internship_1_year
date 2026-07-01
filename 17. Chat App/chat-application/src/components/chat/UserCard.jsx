import { useAuth } from "../../hooks/useAuth";
import { togglePinConversation, toggleArchiveConversation } from "../../services/chatService";
import { formatMessageTime } from "../../utils/helpers";

function UserCard({
    otherUser,
    active,
    lastMessage,
    unreadCount,
    isPinned,
    isArchived,
    onClick,
}) {
    const { user } = useAuth();

    // Toggle Pin status
    const handlePin = async (e) => {
        e.stopPropagation();
        try {
            await togglePinConversation(user.uid, otherUser.uid, !isPinned);
        } catch (err) {
            console.error("Failed to pin:", err);
        }
    };

    // Toggle Archive status
    const handleArchive = async (e) => {
        e.stopPropagation();
        try {
            await toggleArchiveConversation(user.uid, otherUser.uid, !isArchived);
        } catch (err) {
            console.error("Failed to archive:", err);
        }
    };

    // Message text snippet format
    const renderSnippet = () => {
        if (!lastMessage) return <span style={{ fontStyle: "italic", fontSize: "12px", color: "var(--wa-text-muted)" }}>No messages</span>;

        if (lastMessage.deleted) {
            return <span style={{ fontStyle: "italic", fontSize: "12px", color: "var(--wa-text-muted)" }}>Deleted message</span>;
        }

        const prefix = lastMessage.senderId === user.uid ? "You: " : "";
        if (lastMessage.image) {
            return <span style={{ fontSize: "12px", color: "var(--wa-text-muted)" }}>{prefix}📷 Image</span>;
        }
        return <span style={{ fontSize: "12px", color: "var(--wa-text-muted)" }}>{prefix}{lastMessage.text}</span>;
    };

    return (
        <div
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 8px",
                cursor: "pointer",
                borderBottom: "1px solid var(--wa-border)",
                backgroundColor: active ? "var(--wa-active-chat)" : "transparent",
                transition: "background-color 0.2s",
                position: "relative",
            }}
        >
            {/* Status dot */}
            <div
                style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: otherUser.online ? "var(--wa-green)" : "#8596a0",
                    marginRight: "10px",
                    flexShrink: 0,
                }}
            ></div>

            {/* Profile Avatar */}
            <img
                src={otherUser.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
                alt="Avatar"
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "12px",
                    objectFit: "cover",
                    backgroundColor: "#ddd",
                    flexShrink: 0,
                }}
            />

            {/* Details info */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h4 style={{ margin: 0, fontSize: "15px", color: "var(--wa-text)", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {otherUser.displayName}
                    </h4>
                    {lastMessage?.createdAt && (
                        <span style={{ fontSize: "11px", color: "var(--wa-text-muted)", marginLeft: "4px" }}>
                            {formatMessageTime(lastMessage.createdAt)}
                        </span>
                    )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: "6px", flex: 1 }}>
                        {renderSnippet()}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                        {isPinned && <span style={{ fontSize: "11px" }}>📌</span>}
                        {unreadCount > 0 && (
                            <span
                                style={{
                                    backgroundColor: "var(--wa-green)",
                                    color: "#wa-bubble-in",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    borderRadius: "10px",
                                    padding: "2px 6px",
                                    display: "inline-block",
                                }}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions Hover Menu */}
            <div
                className="wa-card-actions"
                style={{
                    display: "flex",
                    gap: "6px",
                    marginLeft: "8px",
                }}
            >
                <button
                    onClick={handlePin}
                    style={{
                        background: "none",
                        border: "none",
                        fontSize: "12px",
                        cursor: "pointer",
                        padding: "2px",
                    }}
                    title={isPinned ? "Unpin" : "Pin"}
                >
                    {isPinned ? "📍" : "📌"}
                </button>
                <button
                    onClick={handleArchive}
                    style={{
                        background: "none",
                        border: "none",
                        fontSize: "12px",
                        cursor: "pointer",
                        padding: "2px",
                    }}
                    title={isArchived ? "Unarchive" : "Archive"}
                >
                    {isArchived ? "📥" : "📁"}
                </button>
            </div>
        </div>
    );
}

export default UserCard;