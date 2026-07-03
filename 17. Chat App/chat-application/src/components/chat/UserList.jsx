import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { 
    listenToUsers, 
    listenToLastMessage, 
    listenToUnreadCount,
    listenToTypingStatus
} from "../../services/chatService";
import UserCard from "./UserCard";

function UserList({ activePartner, onSelectPartner, searchQuery, filter }) {
    const { user, userData } = useAuth();
    const [allUsers, setAllUsers] = useState([]);
    const [lastMessages, setLastMessages] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({});
    const [typingStates, setTypingStates] = useState({});
    const [loading, setLoading] = useState(true);

    // 1. Listen to all users in the system
    useEffect(() => {
        setLoading(true);
        const unsubscribe = listenToUsers((users) => {
            // Exclude current user
            const filtered = users.filter((u) => u.uid !== user?.uid);
            setAllUsers(filtered);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // 2. Setup dynamic listeners for last message, unread count, and typing status for each user
    useEffect(() => {
        if (allUsers.length === 0 || !user?.uid) return;

        const lastMsgUnsubscribes = {};
        const unreadUnsubscribes = {};
        const typingUnsubscribes = {};

        allUsers.forEach((otherUser) => {
            const partnerUid = otherUser.uid;

            // Subscribe to last message
            lastMsgUnsubscribes[partnerUid] = listenToLastMessage(user.uid, partnerUid, (lastMsg) => {
                setLastMessages((prev) => ({
                    ...prev,
                    [partnerUid]: lastMsg,
                }));
            });

            // Subscribe to unread count
            unreadUnsubscribes[partnerUid] = listenToUnreadCount(user.uid, partnerUid, (count) => {
                setUnreadCounts((prev) => ({
                    ...prev,
                    [partnerUid]: count,
                }));
            });

            // Subscribe to typing status
            typingUnsubscribes[partnerUid] = listenToTypingStatus(user.uid, partnerUid, (isTyping) => {
                setTypingStates((prev) => ({
                    ...prev,
                    [partnerUid]: isTyping,
                }));
            });
        });

        // Clean up subscriptions
        return () => {
            Object.values(lastMsgUnsubscribes).forEach((unsub) => unsub());
            Object.values(unreadUnsubscribes).forEach((unsub) => unsub());
            Object.values(typingUnsubscribes).forEach((unsub) => unsub());
        };
    }, [allUsers, user]);

    // 3. Filter and sort users
    const getFilteredAndSortedUsers = () => {
        let list = [...allUsers];

        // Search filtering
        if (searchQuery.trim()) {
            const queryText = searchQuery.toLowerCase();
            list = list.filter(
                (u) =>
                    u.displayName?.toLowerCase().includes(queryText) ||
                    u.email?.toLowerCase().includes(queryText)
            );
        }

        const pinnedList = userData?.pinnedChats || [];
        const archivedList = userData?.archivedChats || [];

        // Tab selection filters
        if (filter === "pinned") {
            list = list.filter((u) => pinnedList.includes(u.uid));
        } else if (filter === "archived") {
            list = list.filter((u) => archivedList.includes(u.uid));
        } else {
            // 'all' - exclude archived chats
            list = list.filter((u) => !archivedList.includes(u.uid));
        }

        // Sorting: Pinned first, then by last message timestamp (most recent first), then alphabetically
        return list.sort((a, b) => {
            const aPinned = pinnedList.includes(a.uid);
            const bPinned = pinnedList.includes(b.uid);

            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;

            // Sort by last message time if available
            const aTime = lastMessages[a.uid]?.createdAt?.toMillis
                ? lastMessages[a.uid].createdAt.toMillis()
                : lastMessages[a.uid]?.createdAt || 0;
            const bTime = lastMessages[b.uid]?.createdAt?.toMillis
                ? lastMessages[b.uid].createdAt.toMillis()
                : lastMessages[b.uid]?.createdAt || 0;

            if (bTime !== aTime) {
                return bTime - aTime;
            }

            // Fallback to alphabetical display name
            const aName = a.displayName || "";
            const bName = b.displayName || "";
            return aName.localeCompare(bName);
        });
    };

    const displayList = getFilteredAndSortedUsers();

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "12px" }}>
                {[1, 2, 3, 4].map((n) => (
                    <div
                        key={n}
                        className="skeleton-shimmer"
                        style={{
                            height: "64px",
                            borderRadius: "10px",
                            width: "100%",
                        }}
                    ></div>
                ))}
            </div>
        );
    }

    if (displayList.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--color-text-muted)", fontSize: "14px" }}>
                {filter === "pinned"
                    ? "No pinned conversations."
                    : filter === "archived"
                    ? "No archived conversations."
                    : "No conversations found."}
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {displayList.map((otherUser) => {
                const partnerUid = otherUser.uid;
                const isPinned = (userData?.pinnedChats || []).includes(partnerUid);
                const isArchived = (userData?.archivedChats || []).includes(partnerUid);

                return (
                    <UserCard
                        key={partnerUid}
                        otherUser={otherUser}
                        active={activePartner?.uid === partnerUid}
                        lastMessage={lastMessages[partnerUid]}
                        unreadCount={unreadCounts[partnerUid] || 0}
                        isPinned={isPinned}
                        isArchived={isArchived}
                        isTyping={!!typingStates[partnerUid]}
                        onClick={() => onSelectPartner(otherUser)}
                    />
                );
            })}
        </div>
    );
}

export default UserList;