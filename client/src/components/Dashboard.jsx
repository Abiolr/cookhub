import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const API_BASE_URL = 'https://cookhub-production.up.railway.app';

function Dashboard({ currentUser, onViewRecipe }) {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Dashboard mounted, currentUser:', currentUser);
    console.log('Dashboard onViewRecipe prop:', onViewRecipe);
    
    if (currentUser && currentUser.userId) {
      console.log('Fetching recipes for user:', currentUser.userId);
      fetchUserRecipes();
    } else {
      console.log('No current user, skipping fetch');
      setIsLoading(false);
    }
  }, [currentUser]);

  const fetchUserRecipes = async () => {
    setIsLoading(true);
    setError('');

    const url = `${API_BASE_URL}/user/${currentUser.userId}/recipes`;
    console.log('Fetching recipes from:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        console.log('Recipes loaded:', data.recipes);
        setSavedRecipes(data.recipes || []);
      } else {
        console.error('Failed to load recipes:', data.message);
        setError(data.message || 'Failed to load recipes');
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRecipe = () => {
    alert('Create Recipe feature - Coming soon!');
  };

  const handleAIAssistant = () => {
    alert('AI Recipe Assistant - Coming soon!');
  };

  const handleViewRecipe = (recipe) => {
    console.log('=== VIEW RECIPE CLICKED ===');
    console.log('Recipe data:', recipe);
    console.log('onViewRecipe function:', onViewRecipe);
    
    if (onViewRecipe && typeof onViewRecipe === 'function') {
      console.log('Calling onViewRecipe...');
      onViewRecipe(recipe);
    } else {
      console.error('onViewRecipe is not a function or is undefined');
    }
  };

  if (!currentUser) {
    return (
      <main className="recipes-dashboard">
        <div className="error-container">
          <h2>Please log in to view your dashboard</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="recipes-dashboard">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-container">
          <h1 className="welcome-title">
            Welcome, <span className="user-name">{currentUser.username}</span>!
          </h1>
          <p className="welcome-subtitle">Ready to cook something amazing today?</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="action-card create-recipe-card">
          <div className="action-content">
            <h3>Create New Recipe</h3>
            <p>Share your culinary creations with the community</p>
            <button onClick={handleCreateRecipe} className="action-button">
              Create Recipe
            </button>
          </div>
          <div className="action-icon">👨‍🍳</div>
        </div>

        <div className="action-card ai-feature-card">
          <div className="action-content">
            <h3>AI Recipe Assistant</h3>
            <p>Get personalized recipe suggestions based on your ingredients</p>
            <button onClick={handleAIAssistant} className="action-button">
              Try AI Feature
            </button>
          </div>
          <div className="action-icon">🤖</div>
        </div>
      </section>

      {/* Saved Recipes Section */}
      <section className="recipes-section saved-recipes">
        <div className="section-header">
          <h2>My Saved Recipes</h2>
          <button onClick={fetchUserRecipes} className="refresh-button">
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="loading-message">
            <p>Loading your recipes...</p>
          </div>
        ) : savedRecipes.length === 0 ? (
          <div className="no-recipes-message">
            <p>You haven't saved any recipes yet.</p>
            <p>Start by searching for recipes or creating your own!</p>
          </div>
        ) : (
          <div className="recipes-grid">
            {savedRecipes.map((recipe, index) => {
              // Use the data structure returned by the backend
              const ingredientCount = Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0;
              const stepCount = Array.isArray(recipe.instructions) ? recipe.instructions.length : 0;

              return (
                <div key={recipe.recipe_id || index} className="recipe-card">
                  <div className="recipe-image">
                    <img 
                      src={recipe.image_url || 'https://via.placeholder.com/200x150/1a3c34/ffffff?text=Recipe'} 
                      alt={recipe.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x150/1a3c34/ffffff?text=Recipe';
                      }}
                    />
                  </div>
                  <div className="recipe-info">
                    <h3>{recipe.title}</h3>
                    <p className="recipe-meta">
                      {ingredientCount} ingredients • {stepCount} steps
                    </p>
                    <div className="recipe-actions">
                      <button 
                        className="recipe-btn view-btn"
                        onClick={() => handleViewRecipe(recipe)}
                      >
                        View Recipe
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;