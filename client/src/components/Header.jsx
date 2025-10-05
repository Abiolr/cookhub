import logoUrl from '../assets/CookHub_Logo.png'

function Header({isLoggedIn, setIsLoggedIn}) {
    
    return (<header className="header">{isLoggedIn  ? (
    <div>
    <img src={logoUrl} className="header-logo" alt="CookHub Logo"/>
    <button className="header-button-one">Account</button>
    <button className="header-button-two" onClick={handleLogout}>Logout</button>
    <button className="header-search-button">Search</button>
    <button className="header-about-button">About</button>
    </div>
     ) : (
    <div>
    <img src={logoUrl} className="header-logo" alt="CookHub Logo"/>
    <button className="header-button-one" onClick={() => setIsLoggedIn(true)}>Login</button>
    <button className="header-button-two">Sign Up</button>
    </div>
    )}
    </header>)

}

export default Header;