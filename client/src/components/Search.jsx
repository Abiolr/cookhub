import React,{useState} from 'react'

const API_BASE_URL = 'https://cookhub-production.up.railway.app';

export default function Search(){

    const [ingredients, setIngredients]= useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [recipes, setRecipes] = useState([]);

    function handleAddIngredient(){
        const newIngredient = document.getElementById("ingredientInput").value;
        document.getElementById("ingredientInput").value = "";
        setIngredients(i => [...i, newIngredient])
    }
    function handleRemoveIngredient(index){
        setIngredients(ingredients.filter((_, i) => i !== index))
    }
    const handleSearch=async(e) => {
        e.preventDefault();
        setError("")

        if(ingredients.length === 0){
            setError("Please enter at least one ingredient")
            return;
        }
        setIsLoading(true)
        try{
            const response = await fetch(`${API_BASE_URL}/search_recipes`, {
                method: 'POST',
                headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredients: ingredients
          }),
        });
        const data=await response.json();

        if(!response.ok){
            setError(data.message || 'search failed');
        }
        else{
            console.log("search complete", data);
        }
    } catch (err) {
        setError('Network error. Please try again later.');
      } finally {
        setIsLoading(false);
      }

        




    }



    return(<div>
        <h2>Ingredients: </h2>
        <ul>
            {ingredients.map((ingredient, index) => 
            <li key={index} onClick={() => handleRemoveIngredient(index)}>
                {ingredient}
                </li>)}
        </ul>
        <input type="text" id="ingredientInput" placeholder="Enter your ingredients"/>
        <button onClick={(e) => handleAddIngredient(e)}>Add ingredient</button>
        <button onClick={(e) => handleSearch(e)}>Search</button>
        <div className="recipe-results">
            {recipes.map((recipe, index) => (
        <div key={index} className="recipe-item">
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            <p className="recipe-title">{recipe.title}</p>
        </div>
    ))}
    </div>

    </div>) 

}