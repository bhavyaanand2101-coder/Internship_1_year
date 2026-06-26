// Import React Router for page navigation and protection
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// Import custom contexts for accessing global state
import { useApp } from "./context/AppContext";
import { useAuth } from "./context/AuthContext";
// Import components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";


export default function App() {
  // Get dark mode state from app context
  const { dark } = useApp();
  // Get current user from auth context
  const { user } = useAuth();
  // Get current URL path to check which page user is on
  const location = useLocation();
  // Check if user is on login page (to hide navbar)
  const isAuthPage = location.pathname === "/login";

  return (
    // Apply dark-mode class if dark mode is enabled
    <div className={dark ? "dark-mode" : ""}>
      {/* Show navbar only if user is logged in AND not on login page */}
      {user && !isAuthPage && <Navbar />}
      
      {/* Define all app routes */}
      <Routes>
        {/* /login - Show login page if NOT logged in, otherwise redirect to home */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        {/* / (Home) - Show home page if logged in, otherwise redirect to login */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        
        {/* /cart - Show cart if logged in, otherwise redirect to login */}
        <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
        
        {/* /* - Catch all unknown routes and redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}