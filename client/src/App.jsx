import { useState } from 'react'
import Header from './components/Header.jsx'
import Homepage from './components/Homepage.jsx'
import Search from './components/Search.jsx'
import Registration from './components/Registration.jsx'  

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
    <Search/>
    </>
  )
}

export default App