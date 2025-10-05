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

# ✅ Spoonacular API key
API_KEY = os.getenv("SPOONACULAR_KEY")

# -----------------------------------------------
# 🏠 EXISTING ENDPOINT — Health Check
# -----------------------------------------------
# Initialize database
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

# app.py (Corrected /save_recipe endpoint)

@app.route('/save_recipe', methods=['POST'])
def save_recipe():
    """Save a recipe (identified by its Spoonacular recipe ID) for a user."""
    data = request.get_json()
    
    # 1. ADD 'user_id' to required fields for validation
    required = ['user_id', 'id', 'title', 'ingredients', 'steps', 'image']
    for field in required:
        if field not in data:
            return jsonify({"success": False, "message": f"Missing field: {field}"}), 400

    # 2. Pass ALL SIX arguments to db.save_recipe in the correct order:
    # (user_id, recipe_id, title, ingredients, instructions, image_url)
    success, message = db.save_recipe(
        user_id=data['user_id'],          # Correctly mapped to user_id
        recipe_id=data['id'],             # Correctly mapped to recipe_id
        title=data['title'],
        ingredients=data['ingredients'],
        instructions=data['steps'],        # 'steps' maps to 'instructions' in the DB
        image_url=data['image']           # 'image' maps to 'image_url' in the DB
    )
    
    status = 201 if success else 400
    return jsonify({"success": success, "message": message}), status


@app.route('/user/<int:user_id>/recipes', methods=['GET'])
def get_user_recipes(user_id):
    """Return all saved recipes for a specific user."""
    success, result = db.get_recipes_by_user(user_id)
    if success:
        return jsonify({"success": True, "recipes": result}), 200
    else:
        return jsonify({"success": False, "message": result}), 500


if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
