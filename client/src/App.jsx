import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Homepage from "./components/Homepage.jsx";
import Login from "./components/Login.jsx";
import Registration from "./components/Registration.jsx";
import Dashboard from "./components/Dashboard.jsx";
import View from "./components/View.jsx";
import Search from "./components/Search.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // ✅ Load user session from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setIsLoggedIn(true);
      console.log("Restored user from localStorage:", parsedUser);
    }
  }, []); // runs only once

  // Debug log for development
  useEffect(() => {
    console.log("App State - isLoggedIn:", isLoggedIn, "currentUser:", currentUser);
  }, [isLoggedIn, currentUser]);

  // ✅ Handle successful login/registration
  const handleAuthSuccess = (userData) => {
    console.log("Authentication successful, user data:", userData);
    setCurrentUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData)); // Save for refresh
  };

  // ✅ Handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setSelectedRecipe(null);
    localStorage.removeItem("user"); // Clear session
  };

  // Handle viewing a recipe
  const handleViewRecipe = (recipe) => {
    console.log("Viewing recipe in App:", recipe);
    setSelectedRecipe(recipe);
  };

  return (
    <Router>
      <div className="app">
        <Header 
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<Search />} />
            <Route 
              path="/login" 
              element={
                !isLoggedIn ? (
                  <Login 
                    setIsLoggedIn={setIsLoggedIn} 
                    setCurrentUser={handleAuthSuccess}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                !isLoggedIn ? (
                  <Registration onRegistrationSuccess={handleAuthSuccess} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />

            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                isLoggedIn && currentUser ? (
                  <Dashboard 
                    currentUser={currentUser} 
                    onViewRecipe={handleViewRecipe}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/recipe/:recipeId" 
              element={
                isLoggedIn && currentUser && selectedRecipe ? (
                  <View 
                    recipe={selectedRecipe}
                    currentUser={currentUser}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* ✅ Footer appears on every page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
