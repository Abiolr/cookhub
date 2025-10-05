import "../styles/Header.css";
import logoUrl from "../assets/CookHub_Logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header({ isLoggedIn, currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo - always clickable to go home */}
        <Link to="/" className="logo-link">
          <img
            src={logoUrl}
            className="header-logo"
            alt="CookHub Logo"
          />
        </Link>

        {/* Navigation buttons */}
        <div className="header-nav">
          {isLoggedIn ? (
            // Logged in state
            <>
              <Link 
                to="/dashboard" 
                className={`header-button ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/search" 
                className={`header-button ${isActive('/search') ? 'active' : ''}`}
              >
                Search Recipes
              </Link>
              <button className="header-button">Account</button>
              <button
                className="header-button logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            // Not logged in state
            <>
              <Link 
                to="/login" 
                className={`header-button ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`header-button ${isActive('/register') ? 'active' : ''}`}
              >
                Sign Up
              </Link>
              <Link 
                to="/search" 
                className={`header-button ${isActive('/search') ? 'active' : ''}`}
              >
                Search Recipes
              </Link>
            </>
          )}

          {/* Always visible buttons */}
          <Link 
            to="/about" 
            className={`header-button ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;