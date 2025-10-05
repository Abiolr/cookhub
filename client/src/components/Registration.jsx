import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Registration.css';

const API_BASE_URL = 'https://cookhub-production.up.railway.app';

export default function Registration({ onRegistrationSuccess }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!username || !email || !password1 || !password2) {
            setError("Please enter all fields");
            return;
        }

        if (password1 !== password2) {
            setError("Passwords do not match");
            return;
        }

        if (password1.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password1,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message || 'Registration failed');
            } else {
                console.log('User registered successfully:', data);
                setSuccess('Registration successful! Redirecting to dashboard...');
                
                const userData = {
                    userId: data.user_id,
                    username: username,
                    email: email
                };
                
                setUsername('');
                setEmail('');
                setPassword1('');
                setPassword2('');
                
                setTimeout(() => {
                    if (onRegistrationSuccess) {
                        onRegistrationSuccess(userData);
                    }
                }, 1500);
            }
        } catch (err) {
            setError('Network error. Please try again later.');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigateToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-section">
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Join CookHub</h2>
                    <p className="auth-subtitle">Create your account to start cooking!</p>
                    
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className="success-message">
                                {success}
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password1" className="form-label">
                                Password:
                            </label>
                            <input
                                type="password"
                                id="password1"
                                name="password1"
                                className="form-input"
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                                placeholder="Create a password (min. 6 characters)"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password2" className="form-label">
                                Confirm Password:
                            </label>
                            <input
                                type="password"
                                id="password2"
                                name="password2"
                                className="form-input"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                placeholder="Confirm your password"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Password Match Indicator */}
                        {(password1 || password2) && (
                            <div className="password-match-indicator">
                                <div
                                    className="indicator-circle"
                                    style={{
                                        backgroundColor:
                                            password1 && password2
                                                ? password1 === password2
                                                    ? "#4caf50"
                                                    : "#f44336"
                                                : "#9e9e9e",
                                    }}
                                ></div>
                                <span className="indicator-message">
                                    {password1 && password2
                                        ? password1 === password2
                                            ? "Passwords match"
                                            : "Passwords do not match"
                                        : "Enter both passwords"}
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>Already have an account?</span>
                    </div>

                    <button
                        type="button"
                        className="auth-alt-link"
                        onClick={handleNavigateToLogin}
                        disabled={isLoading}
                    >
                        Login here
                    </button>
                </div>
            </div>
        </div>
    );
}