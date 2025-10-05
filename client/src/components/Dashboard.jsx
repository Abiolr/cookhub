import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const API_BASE_URL = 'https://cookhub-production.up.railway.app';

function Dashboard({ currentUser }) {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Dashboard mounted, currentUser:', currentUser);
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

    try {
      const response = await fetch(
        `${API_BASE_URL}/user/${currentUser.userId}/recipes`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSavedRecipes(data.recipes || []);
      } else {
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
    // Parse the ingredients and instructions
    let ingredients = [];
    let instructions = [];
    
    try {
      ingredients = recipe.ingredients ? JSON.parse(recipe.ingredients) : [];
      instructions = recipe.instructions ? JSON.parse(recipe.instructions) : [];
    } catch (e) {
      console.error('Error parsing recipe data:', e);
    }

    const recipeDetails = `
Recipe: ${recipe.title}

Ingredients:
${ingredients.map((ing, i) => `${i + 1}. ${ing}`).join('\n')}

Instructions:
${instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}
    `.trim();

    alert(recipeDetails);
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
            {savedRecipes.map((recipe) => {
              let ingredientCount = 0;
              let stepCount = 0;
              
              try {
                ingredientCount = recipe.ingredients ? JSON.parse(recipe.ingredients).length : 0;
                stepCount = recipe.instructions ? JSON.parse(recipe.instructions).length : 0;
              } catch (e) {
                console.error('Error parsing recipe counts:', e);
              }

              return (
                <div key={recipe.saved_recipe_id} className="recipe-card">
                  <div className="recipe-image">
                    <img 
                      src={recipe.image_url || 'https://via.placeholder.com/200x150/1a3c34/ffffff?text=Recipe'} 
                      alt={recipe.title}
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
                        View
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