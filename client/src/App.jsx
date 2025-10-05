import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Homepage from "./components/Homepage.jsx";
import Login from "./components/Login.jsx";
import Registration from "./components/Registration.jsx";
import Dashboard from "./components/Dashboard.jsx";
import View from "./components/View.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Debug: Log state changes
  useEffect(() => {
    console.log(
      "App State - isLoggedIn:",
      isLoggedIn,
      "currentUser:",
      currentUser,
      "currentView:",
      currentView
    );
  }, [isLoggedIn, currentUser, currentView]);

  // Handle successful login/registration
  const handleAuthSuccess = (userData) => {
    console.log('Authentication successful, user data:', userData);
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  // Handle logout properly
  const handleLogout = () => {
    console.log("Logging out...");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentView('home');
    setSelectedRecipe(null);
  };

  // Handle viewing a recipe
  const handleViewRecipe = (recipe) => {
    console.log('Viewing recipe in App:', recipe);
    setSelectedRecipe(recipe);
    setCurrentView('view');
  };

  // Handle going back to dashboard from view
  const handleBackToDashboard = () => {
    console.log('Going back to dashboard');
    setCurrentView('dashboard');
    setSelectedRecipe(null);
  };

  // Navigation functions
  const navigateToHome = () => {
    console.log('Navigating to home');
    setCurrentView('home');
  };
  
  const navigateToLogin = () => {
    console.log('Navigating to login');
    setCurrentView('login');
  };
  
  const navigateToRegister = () => {
    console.log('Navigating to register');
    setCurrentView('register');
  };
  
  const navigateToDashboard = () => {
    console.log('Navigating to dashboard');
    if (isLoggedIn) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  // Render current view
  const renderCurrentView = () => {
    console.log('Rendering view:', currentView);
    
    switch (currentView) {
      case 'home':
        return <Homepage />;
      case 'login':
        return (
          <Login 
            setIsLoggedIn={setIsLoggedIn} 
            setCurrentUser={handleAuthSuccess}
            onNavigateToRegister={navigateToRegister}
          />
        );
      case 'register':
        return (
          <Registration 
            onRegistrationSuccess={handleAuthSuccess}
            onNavigateToLogin={navigateToLogin}
          />
        );
      case 'dashboard':
        return isLoggedIn && currentUser ? (
          <Dashboard 
            currentUser={currentUser} 
            onViewRecipe={handleViewRecipe}
          />
        ) : (
          <Login 
            setIsLoggedIn={setIsLoggedIn} 
            setCurrentUser={handleAuthSuccess}
            onNavigateToRegister={navigateToRegister}
          />
        );
      case 'view':
        return isLoggedIn && currentUser ? (
          <View 
            recipe={selectedRecipe}
            onBack={handleBackToDashboard}
            currentUser={currentUser}
          />
        ) : (
          <Login 
            setIsLoggedIn={setIsLoggedIn} 
            setCurrentUser={handleAuthSuccess}
            onNavigateToRegister={navigateToRegister}
          />
        );
      default:
        return <Homepage />;
    }
  };

  return (
    <>
      <Header 
        isLoggedIn={isLoggedIn}
        currentView={currentView}
        onLogout={handleLogout}
        onNavigateToHome={navigateToHome}
        onNavigateToLogin={navigateToLogin}
        onNavigateToRegister={navigateToRegister}
        onNavigateToDashboard={navigateToDashboard}
      />
      {renderCurrentView()}
    </>
  );
}

export default App;