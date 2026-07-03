import { useEffect, useState, useRef } from "react";
import { listenToMessages } from "../../services/chatService";
import Message from "./Message";

const INITIAL_LIMIT = 40;

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

            // Scroll to bottom on new message arrivals
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 80);
        });

        return () => unsubscribe();
    }, [myUid, partnerUid]);

    // 2. Local in-memory pagination
    const handleLoadMore = () => {
        if (loadingMore || allMessages.length <= displayLimit) return;

        setLoadingMore(true);

        if (listRef.current) {
            previousScrollHeight.current = listRef.current.scrollHeight;
        }

        // Increase display slice count by 30
        setDisplayLimit((prev) => prev + 30);

        setTimeout(() => {
            if (listRef.current) {
                const scrollDiff = listRef.current.scrollHeight - previousScrollHeight.current;
                listRef.current.scrollTop = scrollDiff;
            }
            setLoadingMore(false);
        }, 50);
    };

    // Auto-scroll on partner swaps
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, [partnerUid]);

    const handleScroll = () => {
        if (!listRef.current) return;
        // Trigger load-more when reaching top scroll bounds
        if (listRef.current.scrollTop === 0 && allMessages.length > displayLimit && !loadingMore) {
            handleLoadMore();
        }
    };

    // Date formatter helper for separator labels
    const getMessageDateString = (timestamp) => {
        if (!timestamp) return "";
        let date;
        if (timestamp.toMillis) {
            date = new Date(timestamp.toMillis());
        } else if (timestamp.seconds) {
            date = new Date(timestamp.seconds * 1000);
        } else {
            date = new Date(timestamp);
        }
        if (isNaN(date.getTime())) return "";
        
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();

        if (isToday) return "Today";
        if (isYesterday) return "Yesterday";
        
        return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const displayMessages = allMessages.slice(-displayLimit);
    const hasMore = allMessages.length > displayLimit;

    if (loading) {
        return (
            <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {[1, 2, 3].map((n) => (
                    <div
                        key={n}
                        className="skeleton-shimmer"
                        style={{
                            height: "60px",
                            borderRadius: "10px",
                            maxWidth: n % 2 === 0 ? "55%" : "45%",
                            alignSelf: n % 2 === 0 ? "flex-end" : "flex-start",
                        }}
                    ></div>
                ))}
            </div>
        );
    }

    let lastDateLabel = null;

    return (
        <div
            ref={listRef}
            onScroll={handleScroll}
            style={{
                flex: 1,
                padding: "16px 24px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "4px", // standard closer message padding
            }}
        >
            {hasMore && (
                <div
                    onClick={handleLoadMore}
                    style={{
                        textAlign: "center",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "var(--color-text-muted)",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "12px",
                        backgroundColor: "var(--bg-sidebar-search)",
                        width: "fit-content",
                        margin: "0 auto 10px auto",
                        boxShadow: "0 1px 2px var(--color-shadow)",
                    }}
                >
                    {loadingMore ? "Loading..." : "▲ Load Older Messages"}
                </div>
            )}

            {displayMessages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--color-text-muted)", fontStyle: "italic", fontSize: "14px" }}>
                    No messages here yet. Say hello to start the conversation!
                </div>
            ) : (
                displayMessages.map((msg) => {
                    const dateLabel = getMessageDateString(msg.createdAt);
                    const showSeparator = dateLabel && dateLabel !== lastDateLabel;
                    lastDateLabel = dateLabel;

                    return (
                        <div key={msg.id} style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                            {showSeparator && (
                                <div className="date-separator-container">
                                    <span className="date-separator">{dateLabel}</span>
                                </div>
                            )}
                            <Message
                                message={msg}
                                isMe={msg.senderId === myUid}
                                searchText={searchText}
                                onReply={() => onReplySelect(msg)}
                                onImageClick={() => onImageSelect(msg.image)}
                            />
                        </div>
                    );
                })
            )}

            <div ref={bottomRef} style={{ float: "left", clear: "both" }}></div>
        </div>
    );
}

export default MessageList;