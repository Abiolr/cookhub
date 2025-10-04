from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
from database import Database

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))