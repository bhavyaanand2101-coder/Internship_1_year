/**
 * Formats a Firebase timestamp or Date object to a user-friendly string
 * - Today: 10:45 AM
 * - Yesterday: Yesterday
 * - Older: Jun 28
 */
export const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    
    let date;
    if (timestamp.toMillis) {
        date = new Date(timestamp.toMillis());
    } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (isYesterday) {
        return "Yesterday";
    }
    
    // Within current year, show "Month Day" (e.g. "Jun 24")
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
    
    // Older, show full date
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
};

/**
 * Returns a human-friendly "last seen" relative string
 */
export const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Offline";
    
    let date;
    if (timestamp.toMillis) {
        date = new Date(timestamp.toMillis());
    } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return "Offline";

    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return "just now";
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
    
    return `on ${date.toLocaleDateString([], { month: "short", day: "numeric" })}`;
};
