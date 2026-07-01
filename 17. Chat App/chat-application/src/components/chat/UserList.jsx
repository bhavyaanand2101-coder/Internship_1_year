import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { listenToUsers, listenToLastMessage, listenToUnreadCount } from "../../services/chatService";
import UserCard from "./UserCard";

function UserList({ activePartner, onSelectPartner, searchQuery, filter }) {
    const { user, userData } = useAuth();
    const [allUsers, setAllUsers] = useState([]);
    const [lastMessages, setLastMessages] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({});

    // 1. Listen to all users in the system
    useEffect(() => {
        const unsubscribe = listenToUsers((users) => {
            // Exclude the current logged-in user
            const filtered = users.filter((u) => u.uid !== user?.uid);
            setAllUsers(filtered);
        });

        return () => unsubscribe();
    }, [user]);

    // 2. Setup dynamic listeners for last message and unread count for each user
    useEffect(() => {
        if (allUsers.length === 0 || !user?.uid) return;

        const lastMsgUnsubscribes = {};
        const unreadUnsubscribes = {};

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
        });

        // Clean up subscriptions
        return () => {
            Object.values(lastMsgUnsubscribes).forEach((unsub) => unsub());
            Object.values(unreadUnsubscribes).forEach((unsub) => unsub());
        };
    }, [allUsers, user]);

    // 3. Filter and sort users
    const getFilteredAndSortedUsers = () => {
        let list = [...allUsers];

        // Search text filtration
        if (searchQuery.trim()) {
            const queryText = searchQuery.toLowerCase();
            list = list.filter(
                (u) =>
                    u.displayName?.toLowerCase().includes(queryText) ||
                    u.email?.toLowerCase().includes(queryText)
            );
        }

        // Folder filters (Pinned / Archived)
        const pinnedList = userData?.pinnedChats || [];
        const archivedList = userData?.archivedChats || [];

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

    if (displayList.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text)" }}>
                {filter === "pinned"
                    ? "No pinned conversations."
                    : filter === "archived"
                    ? "No archived conversations."
                    : "No conversations found."}
            </div>
        );
    }

    return (
        <>
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
                        onClick={() => onSelectPartner(otherUser)}
                    />
                );
            })}
        </>
    );
}

export default UserList;