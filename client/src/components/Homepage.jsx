// Homepage.jsx
import React from 'react';
import { useNavigate } from "react-router-dom"; // ✅ import this
import "../styles/Homepage.css";

const Homepage = () => {
    const navigate = useNavigate(); // ✅ create the navigate function here
    return (
        <div className="homepage-container">
            <div className="homepage-content">
                
                {/* Main Heading with Animation */}
                <h1>Welcome to CookHub </h1>
                
                {/* Subtitle with Animation Delay */}
                <h2>
                    Your solution for "What should I cook tonight?"
                    <br />
                    Turn those random ingredients into culinary masterpieces.
                </h2>

                {/* How It Works / Feature Section */}
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>1. Input Ingredients</h3>
                        <p>Tell CookHub what you have in your fridge, pantry, or mind. Simple lists are all we need!</p>
                    </div>

                    <div className="feature-item">
                        <h3>2. Discover Recipes</h3>
                        <p>We instantly match your ingredients to thousands of recipes, prioritizing those that use what you have.</p>
                    </div>

                    <div className="feature-item">
                        <h3>3. Save & Cook</h3>
                        <p>Find the perfect meal, check the steps, and save it to your personal collection for later use.</p>
                    </div>
                </div>

                {/* Call to Action */}
                <button 
                    className="cta-button" 
                    onClick={() => navigate("/login")} // ✅ navigates to login page
                >
                    Discover Recipes Now!
                </button>
            </div>
        </div>
    );
}

export default Homepage;