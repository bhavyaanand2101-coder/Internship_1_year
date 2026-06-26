import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// Entry point of the React application
// Wrapping order matters for context access:

ReactDOM.createRoot(document.getElementById("root")).render(
  // HashRouter - works well on GitHub Pages without additional server config
  <HashRouter>
    {/* AuthProvider - provides authentication context (user login state) */}
    <AuthProvider>
      {/* AppProvider - provides app context (cart, search, dark mode, etc) */}
      <AppProvider>
        {/* Main App component with all routes */}
        <App />
      </AppProvider>
    </AuthProvider>
  </HashRouter>
);