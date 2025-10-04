from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
from database import Database
import os

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))