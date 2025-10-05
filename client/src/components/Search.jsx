import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Search.css'; // Add if you have styles

const API_BASE_URL = 'https://cookhub-production.up.railway.app';

export default function Search({ currentUser, onViewRecipe }) {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  const handleAddIngredient = (e) => {
    e.preventDefault();
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients(prev => [...prev, trimmed]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    if (ingredients.length === 0) {
      setError('Please enter at least one ingredient');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search_recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Search failed');
        setRecipes([]);
      } else {
        console.log('Search results:', data);
        // ✅ FIX: Actually set the recipes state
        setRecipes(data);
        
        // ✅ NEW: Show error if no recipes found
        if (data.length === 0) {
          setError('No recipes found with those ingredients. Try different ingredients!');
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Network error. Please try again later.');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NEW: Handle clicking a recipe to view details
  const handleViewRecipe = async (recipe) => {
    try {
      setIsLoading(true);
      // Fetch full recipe details from your backend
      const response = await fetch(`${API_BASE_URL}/recipes/${recipe.id}`);
      const fullRecipe = await response.json();

      if (response.ok) {
        // Format recipe data for View component
        const recipeData = {
          recipe_id: fullRecipe.id,
          title: fullRecipe.title,
          image_url: fullRecipe.image,
          ingredients: fullRecipe.ingredients,
          instructions: fullRecipe.steps,
          isNewRecipe: true // ✅ Flag to show Save button
        };

        // Pass to parent App component
        if (onViewRecipe) {
          onViewRecipe(recipeData);
        }
        navigate(`/recipe/${recipe.id}`);
      } else {
        setError('Failed to load recipe details');
      }
    } catch (err) {
      console.error('Error loading recipe:', err);
      setError('Failed to load recipe details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h1>Find Recipes by Ingredients</h1>
      
      <div className="ingredients-section">
        <h2>Your Ingredients:</h2>
        
        {ingredients.length > 0 && (
          <ul className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <li 
                key={index}
                onClick={() => handleRemoveIngredient(index)}
                className="ingredient-item"
              >
                {ingredient} <span>✕</span>
              </li>
            ))}
          </ul>
        )}

        <div className="ingredient-input">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient(e)}
            placeholder="Enter an ingredient (e.g., chicken, rice)"
          />
          <button onClick={handleAddIngredient}>Add</button>
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading || ingredients.length === 0}
          className="search-button"
        >
          {isLoading ? 'Searching...' : 'Search Recipes'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {recipes.length > 0 && (
        <div className="recipe-results">
          <h2>Here's {recipes.length} results:</h2>
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => handleViewRecipe(recipe)}
                className="recipe-card"
              >
                <img
                  src={recipe.image || 'https://via.placeholder.com/300x200'}
                  alt={recipe.title}
                />
                <div className="recipe-info">
                  <h3>{recipe.title}</h3>
                  <p>
                    ✓ {recipe.usedIngredientCount} ingredients • 
                    Missing {recipe.missedIngredientCount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}