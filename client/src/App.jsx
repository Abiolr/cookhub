import { useState } from 'react'
import Header from './components/Header.jsx'
import Homepage from './components/Homepage.jsx'
import Registration from './components/Registration.jsx'  

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
      <Header/>
      <Registration/>
    </>
  )
}

export default App