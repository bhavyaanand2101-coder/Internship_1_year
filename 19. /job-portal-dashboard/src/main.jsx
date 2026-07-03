// Import React and ReactDOM
import React from "react";
import ReactDOM from "react-dom/client";

// Import Browser Router
import { BrowserRouter } from "react-router-dom";

// Global CSS
import "./index.css";
import "./App.css";

// Import App Component
import App from "./App";
import { JobProvider } from "./context/JobContext";

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <JobProvider>
        <App />
      </JobProvider>
    </BrowserRouter>
  </React.StrictMode>
);