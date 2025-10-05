import { useState } from 'react'
import Header from './components/Header'
import Homepage from './components/Homepage'
import './styles/styles.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Homepage />
      <Footer />
    </>
  )
}

export default App