import { useState } from "react";
import UserList from "../chat/UserList";

function Sidebar({ activePartner, onSelectPartner }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all"); // 'all', 'pinned', 'archived'

    return (
        <div
            style={{
                width: "300px",
                borderRight: "1px solid var(--wa-border)",
                padding: "20px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "#fff",
                color: "var(--wa-text)",
            }}
        >
            <h2 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "var(--wa-green-dark)" }}>Chats</h2>

            {/* WhatsApp Search Input style */}
            <input
                type="text"
                placeholder="Search or start new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px 14px",
                    margin: "5px 0 15px 0",
                    border: "none",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontSize: "14px",
                    backgroundColor: "var(--wa-search-bg)",
                    color: "var(--wa-text)",
                    outline: "none",
                }}
            />

            {/* Filter Pills */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "15px" }}>
                {["all", "pinned", "archived"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        style={{
                            flex: 1,
                            padding: "6px 8px",
                            fontSize: "12px",
                            cursor: "pointer",
                            background: filter === type ? "var(--wa-green)" : "var(--wa-search-bg)",
                            color: filter === type ? "#wa-bubble-in" : "var(--wa-text-muted)",
                            border: "none",
                            borderRadius: "16px",
                            textTransform: "capitalize",
                            fontWeight: "500",
                            transition: "background-color 0.2s",
                        }}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Scrollable List container */}
            <div style={{ flex: 1, overflowY: "auto" }}>
                <UserList
                    activePartner={activePartner}
                    onSelectPartner={onSelectPartner}
                    searchQuery={searchQuery}
                    filter={filter}
                />
            </div>
        </div>
    );
}

export default Sidebar;