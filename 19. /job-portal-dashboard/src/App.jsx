// Import Routes
import { Routes, Route } from "react-router-dom";

// Import Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Import Pages
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import SavedJobs from "./pages/SavedJobs";
import NotFound from "./pages/NotFound";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: "glass-panel",
          style: {
            background: "var(--panel-bg)",
            color: "var(--text-main)",
            border: "1px solid var(--border-color)",
            fontSize: "14px",
            borderRadius: "10px",
            fontFamily: "Inter, sans-serif"
          }
        }}
      />
      
      {/* Navigation Bar */}
      <Header />

      {/* All Routes */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/saved" element={<SavedJobs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;