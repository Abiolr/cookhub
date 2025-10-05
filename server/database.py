import mysql.connector
import os
from dotenv import load_dotenv
from datetime import datetime
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
        """(Dev only) Drop & recreate the Users table."""
        connection = self.get_db_connection()
        cursor = connection.cursor()

        # ✅ Disable FK checks temporarily
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

        drop_query = "DROP TABLE IF EXISTS Users"
        create_query = """
        CREATE TABLE Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """

        try:
            cursor.execute(drop_query)
            cursor.execute(create_query)
            connection.commit()
            print("✅ Users table recreated successfully!")
        except mysql.connector.Error as e:
            print(f"❌ Error creating Users table: {e}")
        finally:
            # ✅ Re-enable FK checks
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
            cursor.close()
            connection.close()



    def create_recipes_table(self):
        """(Dev only) Drop & recreate the Recipes table."""
        connection = self.get_db_connection()
        cursor = connection.cursor()

        drop_query = "DROP TABLE IF EXISTS Recipes"
        create_query = """
        CREATE TABLE Recipes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            image_url VARCHAR(255),
            ingredients JSON NOT NULL,
            instructions JSON NOT NULL,
            user_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
        )
        """

        try:
            cursor.execute(drop_query)
            cursor.execute(create_query)
            connection.commit()
            print("✅ Recipes table recreated successfully!")
        except mysql.connector.Error as e:
            print(f"❌ Error creating Recipes table: {e}")
        finally:
            cursor.close()
            connection.close()

    def create_database_tables(self):
        """Create all database tables."""
        self.create_users_table()
        self.create_recipes_table()
        print("All database tables created successfully!")

    def user_exists(self, username=None, email=None):
        """Check if a user already exists with the given username or email.
        
        Args:
            username (str): Username to check.
            email (str): Email to check.
            
        Returns:
            bool: True if user exists, False otherwise.
        """
        if not username and not email:
            return False
            
        connection = self.get_db_connection()
        cursor = connection.cursor()
        
        try:
            if username and email:
                query = "SELECT id FROM Users WHERE username = %s OR email = %s"
                cursor.execute(query, (username, email))
            elif username:
                query = "SELECT id FROM Users WHERE username = %s"
                cursor.execute(query, (username,))
            else:
                query = "SELECT id FROM Users WHERE email = %s"
                cursor.execute(query, (email,))
                
            result = cursor.fetchone()
            return result is not None
            
        except mysql.connector.Error as e:
            print(f"Error checking if user exists: {e}")
            return True
        finally:
            cursor.close()
            connection.close()

    def add_user(self, username, email, password):
        """Add a new user to the database.
        
        Args:
            username (str): User's username.
            email (str): User's email.
            password (str): User's password.
            
        Returns:
            tuple: (success: bool, message: str, user_id: int)
        """
        # Check if user already exists
        if self.user_exists(username=username, email=email):
            return False, "Username or email already exists", None
            
        connection = self.get_db_connection()
        cursor = connection.cursor()
        
        try:
            query = """
            INSERT INTO Users (username, email, password) 
            VALUES (%s, %s, %s)
            """
            
            cursor.execute(query, (username, email, password))
            connection.commit()
            
            user_id = cursor.lastrowid
            
            return True, "User registered successfully", user_id
            
        except mysql.connector.Error as e:
            connection.rollback()
            print(f"Error adding user to database: {e}")
            return False, f"Database error: {e}", None
        finally:
            cursor.close()
            connection.close()

    def login_user(self, username, password):
        """Authenticate a user with username and password.
        
        Args:
            username (str): User's username.
            password (str): User's password.
            
        Returns:
            tuple: (success: bool, message: str, user_data: dict)
        """
        connection = self.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        try:
            query = """
            SELECT id, username, email, created_at 
            FROM Users 
            WHERE username = %s AND password = %s
            """
            
            cursor.execute(query, (username, password))
            user = cursor.fetchone()
            
            if user:
                return True, "Login successful", user
            else:
                return False, "Invalid username or password", None
                
        except mysql.connector.Error as e:
            print(f"Error during login: {e}")
            return False, f"Database error: {e}", None
        finally:
            cursor.close()
            connection.close()
            
    def save_recipe(self, user_id, title, ingredients, instructions, image_url):
        """Save a recipe to the Recipes table."""
        connection = self.get_db_connection()
        cursor = connection.cursor()
        try:
            query = """
            INSERT INTO Recipes (user_id, title, image_url, ingredients, instructions, created_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
            """
            cursor.execute(query, (
                user_id,
                title,
                image_url,
                json.dumps(ingredients),
                json.dumps(instructions)
            ))
            connection.commit()
            return True, "Recipe saved successfully"
        except mysql.connector.Error as e:
            connection.rollback()
            print(f"Error saving recipe: {e}")
            return False, f"Database error: {e}"
        finally:
            cursor.close()
            connection.close()


if __name__ == "__main__":
    db = Database()
    db.create_database_tables()