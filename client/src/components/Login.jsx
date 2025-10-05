import { useState } from 'react';

const API_BASE_URL = 'https://cookhub-production.up.railway.app';

function Login({ setIsLoggedIn, setCurrentUser, onNavigateToRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      console.log('API Response:', response.status, data);

      if (response.ok && data.success) {
        console.log('Login successful, user data:', data.user);
        
        // Create user data object
        const userData = {
          userId: data.user.id,
          username: data.user.username,
          email: data.user.email
        };
        
        console.log('Setting user data:', userData);
        
        // Call the parent handler
        if (setCurrentUser) {
          setCurrentUser(userData);
        }
        
        // Clear form
        setFormData({
          username: '',
          password: ''
        });
      } else {
        // Handle login failure
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to CookHub</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? 
            <span 
              className="register-link" 
              onClick={onNavigateToRegister}
              style={{cursor: 'pointer', color: '#1a3c34', fontWeight: 'bold', marginLeft: '5px'}}
            >
              Sign Up
            </span>
          </p>
          <p className="test-account">
            <strong>Test Account:</strong><br />
            Username: testuser<br />
            Password: testpass123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;