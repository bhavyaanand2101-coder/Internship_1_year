import React from "react";

function Loader() {
    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}></div>
        </div>
    );
}

const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100%",
    backgroundColor: "var(--bg-app)",
    transition: "background-color 0.3s ease",
};

const spinnerStyle = {
    width: "48px",
    height: "48px",
    border: "4px solid var(--color-border)",
    borderBottomColor: "var(--color-accent)",
    borderRadius: "50%",
    display: "inline-block",
    boxSizing: "border-box",
    animation: "rotation 1s linear infinite",
};

// Add keyframes to document head
if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

export default Loader;
