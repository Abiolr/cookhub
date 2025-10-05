import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Homepage from "./components/Homepage.jsx";
import Login from "./components/Login.jsx";
import Registration from "./components/Registration.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Debug: Log state changes
  useEffect(() => {
    console.log(
      "App State - isLoggedIn:",
      isLoggedIn,
      "currentUser:",
      currentUser
    );
  }, [isLoggedIn, currentUser]);

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
            onNavigateToRegister={() => setCurrentView('register')}
          />
        );
      case 'register':
        return (
          <Registration 
            onRegistrationSuccess={handleAuthSuccess}
            onNavigateToLogin={() => setCurrentView('login')}
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
            onNavigateToRegister={() => setCurrentView('register')}
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
            onNavigateToRegister={() => setCurrentView('register')}
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
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {!isLoggedIn ? (
        <Login setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />
      ) : (
        <Homepage currentUser={currentUser} />
      )}
    </>
  );
}

export default App;
