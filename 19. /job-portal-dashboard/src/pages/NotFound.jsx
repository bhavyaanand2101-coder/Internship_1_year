import React from "react";
import { Link } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";

function NotFound() {
    return (
        <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}>
            <div className="empty-state animate-fade-in" style={{ margin: "0 auto" }}>
                <IoWarningOutline className="empty-icon" style={{ color: "#f59e0b" }} />
                <h1 style={{ fontSize: "56px", fontWeight: "800", margin: "0 0 10px 0", color: "var(--primary)" }}>404</h1>
                <h3>Page Not Found</h3>
                <p>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link to="/">
                    <button className="reset-search-btn">
                        Return to Homepage
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
