import "../styles/Header.css";
import logoUrl from "../assets/CookHub_Logo.png"; // ✅ correct import path

function Header({
  isLoggedIn,
  currentView,
  onLogout,
  onNavigateToHome,
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToDashboard,
}) {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo - always clickable to go home */}
        <img
          src={logoUrl}
          className="header-logo"
          alt="CookHub Logo"
          onClick={onNavigateToHome}
          style={{ cursor: "pointer" }}
        />

        {/* Navigation buttons */}
        <div className="header-nav">
          {isLoggedIn ? (
            // Logged in state
            <>
              <button
                className={`header-button ${
                  currentView === "dashboard" ? "active" : ""
                }`}
                onClick={onNavigateToDashboard}
              >
                Dashboard
              </button>
              <button className="header-button">Account</button>
              <button
                className="header-button logout-button"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            // Not logged in state
            <>
              <button
                className={`header-button ${
                  currentView === "login" ? "active" : ""
                }`}
                onClick={onNavigateToLogin}
              >
                Login
              </button>
              <button
                className={`header-button ${
                  currentView === "register" ? "active" : ""
                }`}
                onClick={onNavigateToRegister}
              >
                Sign Up
              </button>
            </>
          )}

          {/* Always visible buttons */}
          <button className="header-button">Search</button>
          <button className="header-button">About</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
