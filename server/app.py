from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import mysql.connector
import os
import requests
from dotenv import load_dotenv
from database import Database

# Load environment variables (for API keys, DB creds, etc.)
load_dotenv()

app = Flask(__name__)
CORS(app)

# ✅ Spoonacular API key
API_KEY = os.getenv("SPOONACULAR_KEY")

# -----------------------------------------------
# 🏠 EXISTING ENDPOINT — Health Check
# -----------------------------------------------
@app.route('/')
def home():
    """Health check endpoint.
    
    Returns:
        dict: Service status and version information.
    """
    return jsonify({
        "status": "ok",
        "service": "CookHub API",
        "version": "1.0"
        })

# -----------------------------------------------
# 🍳 NEW ENDPOINT — Search Recipes by Ingredients
# -----------------------------------------------
@app.route('/search_recipes', methods=['POST'])
def search_recipes():
    """Find recipes that use the given list of ingredients."""
    data = request.get_json()
    ingredients = data.get('ingredients', [])

    if not ingredients or not isinstance(ingredients, list):
        return jsonify({"error": "Please provide a list of ingredients."}), 400

    params = {
        "ingredients": ",".join(ingredients),
        "number": 3,              # how many results to return
        "ranking": 1,              # 1 = maximize used ingredients
        "ignorePantry": True,
        "apiKey": API_KEY
    }

    try:
        response = requests.get(
            "https://api.spoonacular.com/recipes/findByIngredients",
            params=params
        )
        response.raise_for_status()
        recipes = response.json()

        # Simplify response for frontend
        result = [
            {
                "id": r["id"],
                "title": r["title"],
                "image": r.get("image"),  # direct URL for <img src=...>
                "usedIngredientCount": r.get("usedIngredientCount"),
                "missedIngredientCount": r.get("missedIngredientCount")
            }
            for r in recipes
        ]

        return jsonify(result), 200

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------------------------
# 🥘 NEW ENDPOINT — Get Recipe Details by ID
# -----------------------------------------------
@app.route('/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    """Get full details (ingredients, steps, image) for a recipe."""
    if not API_KEY:
        return jsonify({"error": "Missing Spoonacular API key."}), 500

    params = {"includeNutrition": False, "apiKey": API_KEY}

    try:
        response = requests.get(
            f"https://api.spoonacular.com/recipes/{recipe_id}/information",
            params=params
        )
        response.raise_for_status()
        info = response.json()

        # Parse ingredients and instructions
        ingredients = [ing["original"] for ing in info.get("extendedIngredients", [])]

        steps = []
        analyzed = info.get("analyzedInstructions", [])
        if analyzed and analyzed[0].get("steps"):
            steps = [s["step"] for s in analyzed[0]["steps"]]
        elif info.get("instructions"):
            steps = [info["instructions"]]

        recipe = {
            "id": info["id"],
            "title": info["title"],
            "image": info.get("image"),
            "ingredients": ingredients,
            "steps": steps
        }

        return jsonify(recipe), 200

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------------------------
# 🚀 Run the Server
# -----------------------------------------------
if __name__ == '__main__':
    print("Starting Flask server...")
    app.run()
