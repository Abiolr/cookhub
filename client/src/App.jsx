import { useState } from 'react'
import Header from './components/Header'
import Login from './components/Login'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Login setIsLoggedIn={setIsLoggedIn} />
    </>
  )
}

export default App