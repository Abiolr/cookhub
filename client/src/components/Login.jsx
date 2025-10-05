import { useState } from "react";
import "../styles/Login.css";

const API_BASE_URL = "https://cookhub-production.up.railway.app";

function Login({ setIsLoggedIn, setCurrentUser, onNavigateToRegister }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log("API Response:", response.status, data);

      if (response.ok && data.success) {
        console.log('Login successful, user data:', data.user);
        
        // Create user data object
        const userData = {
          userId: data.user.id,
          username: data.user.username,
          email: data.user.email,
        };
        
        console.log('Setting user data:', userData);
        
        // Call the parent handler
        if (setCurrentUser) {
          setCurrentUser(userData);
        }
        
        // Clear form
        setFormData({
          username: "",
          password: "",
        });
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-section">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Login to CookHub</h2>
          <p className="auth-subtitle">Welcome back! Please enter your details.</p>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Enter"}
            </button>
          </form>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <button 
            className="auth-alt-link"
            onClick={onNavigateToRegister}
            disabled={isLoading}
          >
            Create account
          </button>
          
          <div className="test-account">
            <p><strong>Test Account:</strong></p>
            <p>Username: testuser</p>
            <p>Password: testpass123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;