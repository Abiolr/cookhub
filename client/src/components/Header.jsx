import logoUrl from '../assets/CookHub_Logo.png'

function Header({isLoggedIn, setIsLoggedIn}) {
    
    return (<header className="header">{isLoggedIn  ? (
    // if logged in
    <div>
    <img src={logoUrl} className="header-logo"/>
    <button className="header-button-one">Account</button>
    <button className="header-button-two" onClick={() => setIsLoggedIn(!isLoggedIn)}>Logout</button>
    <button className="header-search-button">Search</button>
    <button className="header-about-button">About</button>
    </div>
     ) : (
    // if not logged in
    <div>
    <img src={logoUrl} className="header-logo"/>
    <button className="header-button-one" onClick={() => setIsLoggedIn(!isLoggedIn)}>Login</button>
    <button className="header-button-two">Sign Up</button>
    </div>
    )}
    </header>)

}

export default Header;