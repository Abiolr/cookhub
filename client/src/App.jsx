import { useState } from 'react'
import Header from './components/Header.jsx'
import Homepage from './components/Homepage.jsx'
import Registration from './components/Registration.jsx'  

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      <Header/>
      <Registration/>
    </>
  )
}

export default App