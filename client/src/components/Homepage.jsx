import '../styles/styles.css';
import logoImg from '/src/assets/CookHub_Logo.png';

export default function Homepage () {
    return (
        <body>
        <div className="pre-login-header">
            <div className="logo-name">
                <img src="CookHub_Logo.png" alt="CookHub logo" className="logo-image" />
                <span>CookHub</span>
            </div>
            <nav className="auth-buttons">
            <a href="login.html"><button>Login</button></a>
            <a href="register.html"><button>Register</button></a>
            </nav>
        </div>

        <header>
        </header>

        <main>
            <section className="intro">
            <h2>Welcome to CookHub!</h2>
            <p>Join our community to explore amazing recipes, save your favorites, and share your own creations.</p>
            </section>

            <section className="features">
            <h3>What you can do on CookHub:</h3>
            <ul>
                <li>Browse thousands of recipes</li>
                <li>Save your favorite recipes</li>
                <li>Upload and share your own recipes</li>
                <li>Connect with fellow food enthusiasts</li>
            </ul>
            </section>

        </main>

        <footer>
            <p>&copy; 2025 CookHub. All rights reserved.</p>
        </footer>
        </body>
    )
}
