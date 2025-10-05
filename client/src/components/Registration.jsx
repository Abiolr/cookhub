import React, {useState} from 'react'
import '../styles/Registration.css'

const API_BASE_URL = 'https://cookhub-production.up.railway.app';

export default function Registration({ onRegistrationSuccess, onNavigateToLogin }){
    const [username, setUsername]= useState("");
    const [realName, setRealName]= useState("");
    const [password1, setPassword1]= useState("");
    const [password2, setPassword2]= useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // take username from user
    function handleUsernameChange(event){
        setUsername(event.target.value)
    }
    function handleRealNameChange(event){
        setRealName(event.target.value)
    }
    function handlePassword1Change(event){
        setPassword1(event.target.value)
    }
    function handlePassword2Change(event){
        setPassword2(event.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        setSuccess("")

        if(!username || !realName || !password1 || !password2){
            setError("Please enter all fields")
            return;
        }

        if(password1 !== password2){
            setError("Passwords do not match")
            return;
        }

        if(password1.length < 6){
            setError("Password must be at least 6 characters long")
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
                    email: realName,
                    password: password1,
                }),
            });

            const data = await response.json();

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            email: realName,
            password: password1,
          }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          setError(data.message || 'Registration failed');
        } else {
          console.log('User registered:', data);
          setUsername('');
          setRealName('');
          setPassword1('');
          setPassword2('');
        }
      } catch (err) {
        setError('Network error. Please try again later.');
      } finally {
        setIsLoading(false);
      }
            if (!response.ok || !data.success) {
                // Handle errors returned from API
                setError(data.message || 'Registration failed');
            } else {
                // Registration successful
                console.log('User registered successfully:', data);
                setSuccess('Registration successful! Redirecting to dashboard...');
                
                // Create user data object for the app state
                const userData = {
                    userId: data.user_id,
                    username: username,
                    email: realName
                };
                
                // Clear form
                setUsername('');
                setRealName('');
                setPassword1('');
                setPassword2('');
                
                // Call the success callback after a short delay
                setTimeout(() => {
                    if (onRegistrationSuccess) {
                        onRegistrationSuccess(userData);
                    }
                }, 1500);
            }
        } catch (err) {
            // Handle network errors
            setError('Network error. Please try again later.');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <h1 className="registration-header">Create Your CookHub Account</h1>
            
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
            
            <div className="registration-form">
                <input 
                    value={username}
                    onChange={handleUsernameChange} 
                    type="text" 
                    placeholder="Username"
                    disabled={isLoading}
                />
                <input 
                    value={realName}
                    onChange={handleRealNameChange}
                    type="email"
                    placeholder="Email address"
                    disabled={isLoading}
                />
                <input
                    value={password1}
                    onChange={handlePassword1Change}
                    type="password"
                    placeholder="Password"
                    disabled={isLoading}
                />
                <input
                    value={password2}
                    onChange={handlePassword2Change}
                    type="password"
                    placeholder="Confirm password"
                    disabled={isLoading}
                />
                
                <button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="registration-button"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </div>
            
            <div className="password-match-indicator">
                <div
                    className="indicator-circle"
                    style={{
                        backgroundColor:
                        password1 && password2
                            ? password1 === password2
                                ? "green"
                                : "red"
                            : "gray",
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
            
            <div className="registration-footer">
                <p>Already have an account? 
                    <span 
                        className="login-link" 
                        onClick={onNavigateToLogin}
                        style={{cursor: 'pointer', color: '#1a3c34', fontWeight: 'bold', marginLeft: '5px'}}
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    )
}