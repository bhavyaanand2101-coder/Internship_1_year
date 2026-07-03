import { useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { JobContext } from "../context/JobContext";
import { 
    IoBriefcase, 
    IoMoonOutline, 
    IoSunnyOutline, 
    IoMenuOutline, 
    IoCloseOutline 
} from "react-icons/io5";

function Header() {
    const { darkTheme, setDarkTheme } = useContext(JobContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="container">
                {/* Logo Link */}
                <Link to="/" className="logo-container" onClick={closeMobileMenu}>
                    <IoBriefcase className="logo-icon" />
                    <span>CareerHub</span>
                </Link>

                {/* Nav Links */}
                <nav className={`nav-links ${mobileMenuOpen ? "mobile-active" : ""}`}>
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} onClick={closeMobileMenu}>
                        Home
                    </NavLink>
                    <NavLink to="/jobs" className={({ isActive }) => isActive ? "active" : ""} onClick={closeMobileMenu}>
                        Find Jobs
                    </NavLink>
                    <NavLink to="/saved" className={({ isActive }) => isActive ? "active" : ""} onClick={closeMobileMenu}>
                        Saved Jobs
                    </NavLink>
                </nav>

                {/* Nav Actions (Theme Switcher and Hamburger) */}
                <div className="nav-actions">
                    <button 
                        onClick={toggleTheme} 
                        className="theme-toggle-btn"
                        title={darkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        aria-label="Toggle Dark Mode"
                    >
                        {darkTheme ? <IoSunnyOutline /> : <IoMoonOutline />}
                    </button>

                    <button 
                        onClick={toggleMobileMenu} 
                        className="mobile-menu-toggle"
                        aria-label="Toggle mobile menu"
                    >
                        {mobileMenuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;