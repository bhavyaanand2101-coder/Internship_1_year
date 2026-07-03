import React from "react";

function Loader() {
    return (
        <div className="loader-container animate-fade-in">
            <div className="spinner"></div>
            <p style={{ color: "var(--text-muted)", fontSize: "14.5px", fontWeight: "500", margin: 0 }}>
                Compiling relevant job offers...
            </p>
        </div>
    );
}

export default Loader;
