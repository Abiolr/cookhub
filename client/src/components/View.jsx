import React from "react";
import "./View.css";

const View = () => {
  return (
    <div className="recipe-view-page">
      {/* Post-login header */}
      <div className="post-login-header">
        <div className="logo-name">
          <img
            src="src/assets/CookHub_Logo.png"
            alt="CookHub Logo"
            className="logo-image"
          />
          <span>CookHub</span>
        </div>
      </div>

      {/* Recipe View Content */}
      <main className="recipe-view-container">
        {/* Back Navigation */}
        <div className="back-nav">
          <a href="/recipes" className="back-link">
            ← Back to My Recipes
          </a>
        </div>

        {/* Recipe Header */}
        <section className="recipe-header">
          <div className="recipe-hero">
            <img
              src="https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg"
              alt="Spaghetti Carbonara"
              className="recipe-main-image"
            />
            <div className="recipe-overlay">
              <h1 className="recipe-title">Spaghetti Carbonara</h1>
            </div>
          </div>
        </section>

        {/* Recipe Content */}
        <section className="recipe-content">
          <div className="recipe-grid">
            {/* Ingredients Column */}
            <div className="ingredients-column">
              <div className="ingredients-card">
                <h2 className="section-title">Ingredients</h2>
                <div className="serving-size">
                  {/* Serving size selector can be added here if needed */}
                </div>

                <ul className="ingredients-list">
                  <li className="ingredient-item">
                    <input type="checkbox" id="ing1" />
                    <label htmlFor="ing1">400g spaghetti</label>
                  </li>
                  <li className="ingredient-item">
                    <input type="checkbox" id="ing2" />
                    <label htmlFor="ing2">
                      200g pancetta or guanciale, diced
                    </label>
                  </li>
                  <li className="ingredient-item">
                    <input type="checkbox" id="ing3" />
                    <label htmlFor="ing3">4 large eggs</label>
                  </li>
                  <li className="ingredient-item">
                    <input type="checkbox" id="ing4" />
                    <label htmlFor="ing4">
                      100g Pecorino Romano cheese, grated
                    </label>
                  </li>
                  <li className="ingredient-item">
                    <input type="checkbox" id="ing5" />
                    <label htmlFor="ing5">50g Parmesan cheese, grated</label>
                  </li>
                  <li className="ingredient-item">
                    <input type="checkbox" id="ing6" />
                    <label htmlFor="ing6">2 cloves garlic, minced</label>
                  </li>
                  <li className="ingredient-item">
                    <input type="checkbox" id="ing7" />
                    <label htmlFor="ing7">Freshly ground black pepper</label>
                  </li>
                  <li className="ingredient-item">
                    <input type="checkbox" id="ing8" />
                    <label htmlFor="ing8">Salt to taste</label>
                  </li>
                  <li className="ingredient-item">
                    <input type="checkbox" id="ing9" />
                    <label htmlFor="ing9">
                      Fresh parsley, chopped (for garnish)
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            {/* Instructions Column */}
            <div className="instructions-column">
              <div className="instructions-card">
                <h2 className="section-title">Instructions</h2>
                <div className="instructions-list">
                  <div className="instruction-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Prepare the Pasta</h3>
                      <p>
                        Bring a large pot of salted water to boil. Cook
                        spaghetti according to package instructions until al
                        dente. Reserve 1 cup of pasta water before draining.
                      </p>
                    </div>
                  </div>

                  <div className="instruction-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Cook the Pancetta</h3>
                      <p>
                        While pasta is cooking, heat a large skillet over medium
                        heat. Add diced pancetta and cook until crispy and
                        golden brown, about 5-7 minutes. Add minced garlic and
                        cook for 1 more minute.
                      </p>
                    </div>
                  </div>

                  <div className="instruction-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Prepare the Egg Mixture</h3>
                      <p>
                        In a medium bowl, whisk together eggs, grated Pecorino
                        Romano, Parmesan cheese, and a generous amount of black
                        pepper.
                      </p>
                    </div>
                  </div>

                  <div className="instruction-step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Combine Everything</h3>
                      <p>
                        Working quickly, add hot drained pasta to the skillet
                        with pancetta. Remove from heat. Pour egg mixture over
                        pasta, tossing continuously. Add reserved pasta water a
                        little at a time until sauce reaches desired
                        consistency.
                      </p>
                    </div>
                  </div>

                  <div className="instruction-step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h3>Serve Immediately</h3>
                      <p>
                        Divide among warm plates, garnish with additional
                        cheese, black pepper, and fresh parsley. Serve
                        immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 CookHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default View;
