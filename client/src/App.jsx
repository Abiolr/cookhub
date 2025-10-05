import { useState, useEffect } from 'react'
import Header from './components/Header'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Debug: Log state changes
  useEffect(() => {
    console.log('App State - isLoggedIn:', isLoggedIn, 'currentUser:', currentUser);
  }, [isLoggedIn, currentUser]);

  // Handle logout properly
  const handleLogout = () => {
    console.log('Logging out...');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={handleLogout} />
      
      {isLoggedIn && currentUser ? (
        <Dashboard currentUser={currentUser} />
      ) : (
        <Login 
          setIsLoggedIn={setIsLoggedIn} 
          setCurrentUser={setCurrentUser} 
        />
      )}
      
      <Footer />
    </>
  )
}

export default App