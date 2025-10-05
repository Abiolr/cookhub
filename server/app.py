from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import mysql.connector
import os
import requests
from dotenv import load_dotenv
from database import Database
import os

# Load environment variables (for API keys, DB creds, etc.)
load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("SPOONACULAR_KEY")

db = Database()

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
# Search Recipes by Ingredients
# -----------------------------------------------
import random
import requests
from flask import request, jsonify

@app.route('/search_recipes', methods=['POST'])
def search_recipes():
    """Find random recipes that use the given list of ingredients."""
    data = request.get_json()
    ingredients = data.get('ingredients', [])

    if not ingredients or not isinstance(ingredients, list):
        return jsonify({"error": "Please provide a list of ingredients."}), 400

    # Get more recipes to randomize from
    params = {
        "ingredients": ",".join(ingredients),
        "number": 50,  # Get more recipes to choose from
        "ranking": 1,
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

        # Randomly select 3 recipes from the results
        if len(recipes) > 3:
            recipes = random.sample(recipes, 3)
        else:
            recipes = recipes[:3]  # Just take what's available

        # Simplify response for frontend
        result = [
            {
                "id": r["id"],
                "title": r["title"],
                "image": r.get("image"),
                "usedIngredientCount": r.get("usedIngredientCount"),
                "missedIngredientCount": r.get("missedIngredientCount")
            }
            for r in recipes
        ]

        return jsonify(result), 200

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------------------
# Get Recipe Details by ID
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
# Register User
# -----------------------------------------------
@app.route('/register', methods=['POST'])
def register_user():
    """Register a new user.
    
    Expected JSON payload:
    {
        "username": "user123",
        "email": "user@example.com",
        "password": "password123"
    }
    
    Returns:
        JSON response with success status and message.
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({
                "success": False,
                "message": "No JSON data provided"
            }), 400
            
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"Missing required field: {field}"
                }), 400
        
        username = data['username']
        email = data['email']
        password = data['password']
        
        # Add user to database
        success, message, user_id = db.add_user(username, email, password)
        
        if success:
            return jsonify({
                "success": True,
                "message": message,
                "user_id": user_id
            }), 201
        else:
            return jsonify({
                "success": False,
                "message": message
            }), 400
            
    except Exception as e:
        print(f"Error in register endpoint: {e}")
        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500

# -----------------------------------------------
# Login User
# -----------------------------------------------
@app.route('/login', methods=['POST'])
def login_user():
    """Login an existing user.
    
    Expected JSON payload:
    {
        "username": "user123",
        "password": "password123"
    }
    
    Returns:
        JSON response with success status and user data.
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({
                "success": False,
                "message": "No JSON data provided"
            }), 400
            
        required_fields = ['username', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"Missing required field: {field}"
                }), 400
        
        username = data['username']
        password = data['password']
        
        # Authenticate user
        success, message, user_data = db.login_user(username, password)
        
        if success:
            return jsonify({
                "success": True,
                "message": message,
                "user": user_data
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": message
            }), 401  # Unauthorized
            
    except Exception as e:
        print(f"Error in login endpoint: {e}")
        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500

@app.route('/save_recipe', methods=['POST'])
def save_recipe():
    """Save a recipe (identified by its Spoonacular recipe ID)."""
    data = request.get_json()
    required = ['id', 'title', 'ingredients', 'steps', 'image']
    for field in required:
        if field not in data:
            return jsonify({"success": False, "message": f"Missing field: {field}"}), 400

    success, message = db.save_recipe(
        data['id'],           # Spoonacular recipe ID
        data['title'],
        data['ingredients'],
        data['steps'],
        data['image']
    )
    status = 201 if success else 400
    return jsonify({"success": success, "message": message}), status

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
