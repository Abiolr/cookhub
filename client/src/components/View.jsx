import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/View.css";

const API_BASE_URL = 'https://cookhub-production.up.railway.app';

const View = ({ recipe, currentUser }) => {
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('View component mounted with recipe:', recipe);
    console.log('View component currentUser:', currentUser);
  }, [recipe, currentUser]);

  if (!recipe) {
    console.log('No recipe provided to View component');
    return (
      <div className="recipe-view-page">
        <div className="error-container">
          <h2>No recipe selected</h2>
          <p>Please go back and select a recipe to view.</p>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
  const isNewRecipe = recipe.isNewRecipe === true;

  const handleIngredientCheck = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleBackClick = () => {
    navigate(isNewRecipe ? '/search' : '/dashboard');
  };

  // ✅ NEW: Save recipe to user's dashboard
  const handleSaveRecipe = async () => {
    if (!currentUser || !currentUser.userId) {
      setSaveMessage('Error: You must be logged in to save recipes');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/save_recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.userId,
          id: recipe.recipe_id,
          title: recipe.title,
          ingredients: recipe.ingredients,
          steps: recipe.instructions,
          image: recipe.image_url
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSaveMessage('✓ Recipe saved successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setSaveMessage(`Error: ${data.message || 'Failed to save recipe'}`);
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
      setSaveMessage('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="recipe-view-page">
      <main className="recipe-view-container">
        <div className="back-nav">
          <button onClick={handleBackClick} className="back-link">
            ← Back to {isNewRecipe ? 'Search' : 'My Recipes'}
          </button>
        </div>

        <section className="recipe-header">
          <div className="recipe-hero">
            <img
              src={recipe.image_url || 'https://via.placeholder.com/800x400'}
              alt={recipe.title}
              className="recipe-main-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400';
              }}
            />
            <div className="recipe-overlay">
              <h1 className="recipe-title">{recipe.title}</h1>
              <div className="recipe-meta-info">
                <span>{ingredients.length} ingredients</span>
                <span>•</span>
                <span>{instructions.length} steps</span>
                {!isNewRecipe && (
                  <>
                    <span>•</span>
                    <span>Saved by {currentUser?.username}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ✅ NEW: Save button and message for new recipes */}
        {isNewRecipe && (
          <section className="save-section">
            <button
              onClick={handleSaveRecipe}
              disabled={isSaving}
              className="save-recipe-button"
            >
              {isSaving ? 'Saving...' : 'Save to Dashboard'}
            </button>
            {saveMessage && (
              <div className={`save-message ${saveMessage.startsWith('✓') ? 'success' : 'error'}`}>
                {saveMessage}
              </div>
            )}
          </section>
        )}

        <section className="recipe-content">
          <div className="recipe-grid">
            <div className="ingredients-column">
              <div className="ingredients-card">
                <h2 className="section-title">Ingredients</h2>
                <div className="serving-size">
                  <p>Serving size: 2-4 people</p>
                </div>
                <ul className="ingredients-list">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      <input 
                        type="checkbox" 
                        id={`ing${index}`}
                        checked={!!checkedIngredients[index]}
                        onChange={() => handleIngredientCheck(index)}
                      />
                      <label 
                        htmlFor={`ing${index}`}
                        className={checkedIngredients[index] ? 'checked' : ''}
                      >
                        {ingredient}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="instructions-column">
              <div className="instructions-card">
                <h2 className="section-title">Instructions</h2>
                <div className="instructions-list">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="instruction-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">
                        <h3>Step {index + 1}</h3>
                        <p>{instruction}</p>
                      </div>
                    </div>
                  ))}
                  
                  {instructions.length === 0 && (
                    <div className="no-instructions">
                      <p>No instructions available for this recipe.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="recipe-actions">
          <div className="action-buttons">
            <button className="action-button print-button">
              Print Recipe
            </button>
            <button className="action-button share-button">
              Share Recipe
            </button>
          </div>
        </section>
      </main>

    </div>
  );
};

export default View;