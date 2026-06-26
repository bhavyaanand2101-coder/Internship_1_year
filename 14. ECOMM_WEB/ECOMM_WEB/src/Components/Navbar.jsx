import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  // Get search, cart, and dark mode state from app context
  const { cart, search, setSearch, dark, setDark } = useApp();
  
  // Get logout function from auth context
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      {/* Logo - clicking navigates to home page */}
      <Link to="/" className="logo">SHOPMY</Link>
      
      {/* Search bar - updates search state in real-time */}
      <div className="search-container">
        <input 
          className="search-input"
          placeholder="Search products..." 
          value={search}                           // Controlled input - shows current search
          onChange={e => setSearch(e.target.value)} // Update search on each keystroke
        />
      </div>
      
      {/* Right side buttons */}
      <div className="nav-btns">
        {/* Dark mode toggle button */}
        <button 
          className="btn btn-ghost" 
          onClick={() => setDark(!dark)}  // Toggle dark mode
        >
          {/* Show sun icon if dark mode on, moon icon if dark mode off */}
          {dark ? "☀️" : "🌙"}
        </button>
        
        {/* Cart button - shows number of items in cart */}
        <Link to="/cart" className="btn btn-ghost" style={{textDecoration: 'none'}}>
          🛒 Cart ({cart.length})  {/* Dynamically shows cart item count */}
        </Link>
        
        {/* Logout button - signs out user */}
        <button 
          onClick={logout}                          // Call logout function
          className="btn btn-primary" 
          style={{width: 'auto'}}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}