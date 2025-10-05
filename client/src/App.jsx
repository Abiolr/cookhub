import { useState } from 'react'
import Header from './components/Header'
import Homepage from './components/Homepage'
import Footer from './components/Footer' // ✅ Add this

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Homepage />
      <Footer /> {/* ✅ This renders your footer */}
    </>
  )
}

export default App
