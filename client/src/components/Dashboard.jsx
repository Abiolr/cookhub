<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Recipes - CookHub</title>
  <link rel="stylesheet" href="src/styles/Search.css">
</head>
<body>
  <!-- Post-login header -->
  <div class="post-login-header">
    <div class="logo-name">
      <img src="src/assets/CookHub_Logo.png" alt="CookHub Logo" class="logo-image">
      <span>CookHub</span>
    </div>
    
    <nav class="main-nav">
      <a href="search.html" class="nav-link">Search</a>
      <a href="about.html" class="nav-link">About</a>
      <a href="account.html" class="account-link">Account</a>
    </nav>
    
    <div class="user-actions">
      <a href="logout.html" class="logout-btn">Logout</a>
    </div>
  </div>

  <!-- Main Content -->
  <main class="recipes-dashboard">
    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="welcome-container">
        <h1 class="welcome-title">Welcome, <span id="userName">User</span>!</h1>
        <p class="welcome-subtitle">Ready to cook something amazing today?</p>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions">
      <div class="action-card create-recipe-card">
        <div class="action-content">
          <h3>Create New Recipe</h3>
          <p>Share your culinary creations with the community</p>
          <a href="create-recipe.html" class="action-button">Create Recipe</a>
        </div>
        <div class="action-icon">👨‍🍳</div>
      </div>

      <div class="action-card ai-feature-card">
        <div class="action-content">
          <h3>AI Recipe Assistant</h3>
          <p>Get personalized recipe suggestions based on your ingredients</p>
          <a href="ai-assistant.html" class="action-button">Try AI Feature</a>
        </div>
        <div class="action-icon">🤖</div>
      </div>
    </section>

    <!-- My Recipes Section -->
    <section class="recipes-section">
      <div class="section-header">
        <h2>My Recipes</h2>
        <a href="my-recipes.html" class="view-all-link">View All</a>
      </div>
      
      <div class="recipes-grid">
        <div class="recipe-card">
          <div class="recipe-image">
            <img src="https://via.placeholder.com/200x150/1a3c34/ffffff?text=R1" alt="Recipe 1">
          </div>
          <div class="recipe-info">
            <h3>Spaghetti Carbonara</h3>
            <p class="recipe-meta">Italian • 30 mins</p>
            <div class="recipe-actions">
              <button class="recipe-btn view-btn">View</button>
              <button class="recipe-btn edit-btn">Edit</button>
            </div>
          </div>
        </div>

        <div class="recipe-card">
          <div class="recipe-image">
            <img src="https://via.placeholder.com/200x150/2d5c4f/ffffff?text=R2" alt="Recipe 2">
          </div>
          <div class="recipe-info">
            <h3>Vegetable Stir Fry</h3>
            <p class="recipe-meta">Asian • 20 mins</p>
            <div class="recipe-actions">
              <button class="recipe-btn view-btn">View</button>
              <button class="recipe-btn edit-btn">Edit</button>
            </div>
          </div>
        </div>

        <div class="recipe-card">
          <div class="recipe-image">
            <img src="https://via.placeholder.com/200x150/1a3c34/ffffff?text=R3" alt="Recipe 3">
          </div>
          <div class="recipe-info">
            <h3>Chocolate Cake</h3>
            <p class="recipe-meta">Dessert • 60 mins</p>
            <div class="recipe-actions">
              <button class="recipe-btn view-btn">View</button>
              <button class="recipe-btn edit-btn">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Saved Recipes Section -->
    <section class="recipes-section saved-recipes">
      <div class="section-header">
        <h2>Saved Recipes</h2>
        <a href="saved-recipes.html" class="view-all-link">View All</a>
      </div>
      
      <div class="recipes-grid">
        <div class="recipe-card">
          <div class="recipe-image">
            <img src="https://via.placeholder.com/200x150/2d5c4f/ffffff?text=SR1" alt="Saved Recipe 1">
          </div>
          <div class="recipe-info">
            <h3>Greek Salad</h3>
            <p class="recipe-meta">Mediterranean • 15 mins</p>
            <div class="recipe-actions">
              <button class="recipe-btn view-btn">View</button>
              <button class="recipe-btn save-btn">Unsave</button>
            </div>
          </div>
        </div>

        <div class="recipe-card">
          <div class="recipe-image">
            <img src="https://via.placeholder.com/200x150/1a3c34/ffffff?text=SR2" alt="Saved Recipe 2">
          </div>
          <div class="recipe-info">
            <h3>Chicken Curry</h3>
            <p class="recipe-meta">Indian • 45 mins</p>
            <div class="recipe-actions">
              <button class="recipe-btn view-btn">View</button>
              <button class="recipe-btn save-btn">Unsave</button>
            </div>
          </div>
        </div>

        <div class="recipe-card">
          <div class="recipe-image">
            <img src="https://via.placeholder.com/200x150/2d5c4f/ffffff?text=SR3" alt="Saved Recipe 3">
          </div>
          <div class="recipe-info">
            <h3>Avocado Toast</h3>
            <p class="recipe-meta">Breakfast • 10 mins</p>
            <div class="recipe-actions">
              <button class="recipe-btn view-btn">View</button>
              <button class="recipe-btn save-btn">Unsave</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <p>&copy; 2025 CookHub. All rights reserved.</p>
  </footer>

  <script>
    // Set username from session storage
    document.addEventListener('DOMContentLoaded', function() {
      const userName = sessionStorage.getItem('currentUser') || 'User';
      document.getElementById('userName').textContent = userName;
    });
  </script>
</body>
</html>