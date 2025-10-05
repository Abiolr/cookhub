import React, { useState, useEffect } from "react";
import "../styles/View.css";

const View = ({ recipe, onBack, currentUser }) => {
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    console.log('View component mounted with recipe:', recipe);
    console.log('View component onBack function:', onBack);
    console.log('View component currentUser:', currentUser);
  }, [recipe, onBack, currentUser]);

  if (!recipe) {
    console.log('No recipe provided to View component');
    return (
      <div className="recipe-view-page">
        <div className="error-container">
          <h2>No recipe selected</h2>
          <p>Please go back and select a recipe to view.</p>
          <button onClick={onBack} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get ingredients and instructions from the recipe
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];

  console.log('Rendering recipe:', recipe.title);
  console.log('Ingredients count:', ingredients.length);
  console.log('Instructions count:', instructions.length);

  // Handle ingredient checkbox changes
  const handleIngredientCheck = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleBackClick = () => {
    console.log('Back button clicked');
    if (onBack && typeof onBack === 'function') {
      onBack();
    } else {
      console.error('onBack is not a function');
    }
  };

  return (
    <div className="recipe-view-page">
      {/* Recipe View Content */}
      <main className="recipe-view-container">
        {/* Back Navigation */}
        <div className="back-nav">
          <button onClick={handleBackClick} className="back-link">
            ← Back to My Recipes
          </button>
        </div>

        {/* Recipe Header */}
        <section className="recipe-header">
          <div className="recipe-hero">
            <img
              src={recipe.image_url || 'https://via.placeholder.com/800x400/1a3c34/ffffff?text=No+Image+Available'}
              alt={recipe.title}
              className="recipe-main-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400/1a3c34/ffffff?text=No+Image+Available';
              }}
            />
            <div className="recipe-overlay">
              <h1 className="recipe-title">{recipe.title}</h1>
              <div className="recipe-meta-info">
                <span>{ingredients.length} ingredients</span>
                <span>•</span>
                <span>{instructions.length} steps</span>
                <span>•</span>
                <span>Saved by {currentUser?.username}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Content */}
        <section className="recipe-content">
          <div className="recipe-grid">
            {/* Ingredients Column */}
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

            {/* Instructions Column */}
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

        {/* Recipe Actions */}
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

      <footer className="recipe-footer">
        <p>&copy; 2025 CookHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default View;