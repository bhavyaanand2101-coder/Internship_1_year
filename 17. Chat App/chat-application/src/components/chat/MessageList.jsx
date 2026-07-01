import { useEffect, useState, useRef } from "react";
import { listenToMessages } from "../../services/chatService";
import Message from "./Message";

const INITIAL_LIMIT = 30;

function MessageList({
    myUid,
    partnerUid,
    searchText,
    onReplySelect,
    onImageSelect,
    onMessagesChange,
}) {
    const [allMessages, setAllMessages] = useState([]);
    const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const listRef = useRef(null);
    const bottomRef = useRef(null);
    const previousScrollHeight = useRef(0);

    // 1. Subscribe to real-time conversation stream
    useEffect(() => {
        setLoading(true);
        setDisplayLimit(INITIAL_LIMIT);

        const unsubscribe = listenToMessages(myUid, partnerUid, null, (msgs) => {
            setAllMessages(msgs);
            setLoading(false);

            if (onMessagesChange) {
                onMessagesChange(msgs);
            }

            // Scroll to the bottom on new message arrivals
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 80);
        });

        return () => unsubscribe();
    }, [myUid, partnerUid]);

    // 2. Perform local in-memory pagination
    const handleLoadMore = () => {
        if (loadingMore || allMessages.length <= displayLimit) return;

        setLoadingMore(true);

        if (listRef.current) {
            previousScrollHeight.current = listRef.current.scrollHeight;
        }

        // Increase local slice count by 30
        setDisplayLimit((prev) => prev + 30);

        setTimeout(() => {
            if (listRef.current) {
                const scrollDiff = listRef.current.scrollHeight - previousScrollHeight.current;
                listRef.current.scrollTop = scrollDiff;
            }
            setLoadingMore(false);
        }, 50);
    };

    // Auto-scroll anchor on conversation swaps
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, [partnerUid]);

    const handleScroll = () => {
        if (!listRef.current) return;
        // Trigger load-more when reaching the top scroll bounds
        if (listRef.current.scrollTop === 0 && allMessages.length > displayLimit && !loadingMore) {
            handleLoadMore();
        }
    };

    // Calculate subset of messages to display based on current limit state
    const displayMessages = allMessages.slice(-displayLimit);
    const hasMore = allMessages.length > displayLimit;

    if (loading) {
        return (
            <div style={{ flex: 1, padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <span>Loading messages...</span>
            </div>
        );
    }

    return (
        <div
            ref={listRef}
            onScroll={handleScroll}
            style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            {hasMore && (
                <div
                    onClick={handleLoadMore}
                    style={{
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#888",
                        cursor: "pointer",
                        padding: "5px",
                    }}
                >
                    {loadingMore ? "Loading..." : "▲ Click to load older messages"}
                </div>
            )}

            {displayMessages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#888", fontStyle: "italic" }}>
                    No messages here yet. Say hi!
                </div>
            ) : (
                displayMessages.map((msg) => (
                    <Message
                        key={msg.id}
                        message={msg}
                        isMe={msg.senderId === myUid}
                        searchText={searchText}
                        onReply={() => onReplySelect(msg)}
                        onImageClick={() => onImageSelect(msg.image)}
                    />
                ))
            )}

            <div ref={bottomRef} style={{ float: "left", clear: "both" }}></div>
        </div>
    );
}

export default MessageList;