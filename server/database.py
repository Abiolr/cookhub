import mysql.connector
import os
from dotenv import load_dotenv
from datetime import datetime
import uuid
import json
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

class Database:
    def __init__(self):
        self.host = os.environ.get('RLWY_HOST')
        self.user = os.environ.get('RLWY_USER')
        self.password = os.environ.get('RLWY_PASS')
        self.database = os.environ.get('RLWY_DB')
        self.port = os.environ.get('RLWY_PORT')
        self.sql_dir = Path(__file__).parent / "sql"
        
        # Validate that all required environment variables are set
        self._validate_environment()

    def _validate_environment(self):
        """Validate that all required environment variables are set."""
        required_vars = {
            'RLWY_HOST': self.host,
            'RLWY_USER': self.user,
            'RLWY_PASS': self.password,
            'RLWY_DB': self.database,
            'RLWY_PORT': self.port
        }
        
        missing_vars = [var for var, value in required_vars.items() if value is None]
        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

    def _load_sql_query(self, filename):
        """Load SQL query from external file.
        
        Args:
            filename (str): Name of the SQL file to load.
            
        Returns:
            str: SQL query content.
            
        Raises:
            FileNotFoundError: If SQL file doesn't exist.
        """
        sql_path = self.sql_dir / filename
        with open(sql_path, 'r') as f:
            return f.read().strip()

    def get_db_connection(self):
        """Establish database connection with proper configuration.
        
        Creates a new MySQL connection with timezone configuration
        for consistent datetime handling across different environments.
        
        Returns:
            mysql.connector.MySQLConnection: Active database connection.
            
        Raises:
            mysql.connector.Error: If connection fails.
        """
        return mysql.connector.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database,
            port=int(self.port)  # Convert port to integer
        )

    def create_users_table(self):
        """Create the Users table if it doesn't exist."""
        connection = self.get_db_connection()
        cursor = connection.cursor()
        
        create_table_query = """
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        
        try:
            cursor.execute(create_table_query)
            connection.commit()
            print("Users table created successfully!")
        except mysql.connector.Error as e:
            print(f"Error creating Users table: {e}")
        finally:
            cursor.close()
            connection.close()

    def create_recipes_table(self):
        """Create the Recipes table if it doesn't exist."""
        connection = self.get_db_connection()
        cursor = connection.cursor()
        
        create_table_query = """
        CREATE TABLE IF NOT EXISTS Recipes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ingredients JSON NOT NULL,
            instructions TEXT NOT NULL,
            user_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
        )
        """
        
        try:
            cursor.execute(create_table_query)
            connection.commit()
            print("Recipes table created successfully!")
        except mysql.connector.Error as e:
            print(f"Error creating Recipes table: {e}")
        finally:
            cursor.close()
            connection.close()

    def create_database_tables(self):
        """Create all database tables."""
        self.create_users_table()
        self.create_recipes_table()
        print("All database tables created successfully!")

if __name__ == "__main__":
    db = Database()
    db.create_database_tables()