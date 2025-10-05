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

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo always clickable */}
        <Link to="/" className="logo-link">
          <img src={logoUrl} className="header-logo" alt="CookHub Logo" />
        </Link>

        {/* Navigation buttons */}
        <div className="header-nav">
          {isLoggedIn ? (
            // 🔒 Logged-in state
            <>
              <Link
                to="/dashboard"
                className={`header-button ${
                  isActive("/dashboard") ? "active" : ""
                }`}
              >
                Dashboard
              </Link>
              <button
                className="header-button logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            // 🔓 Logged-out state
            <>
              <Link
                to="/login"
                className={`header-button ${
                  isActive("/login") ? "active" : ""
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`header-button ${
                  isActive("/register") ? "active" : ""
                }`}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* 🏠 About (always visible, returns home) */}
          <Link
            to="/"
            className={`header-button ${isActive("/") ? "active" : ""}`}
          >
            About
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
