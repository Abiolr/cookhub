import React, {useState} from 'react'
import '../styles/Registration.css'

export default function Registration(){
    const [username, setUsername]= useState("");
    const [realName, setRealName]= useState("");
    const [password1, setPassword1]= useState("");
    const [password2, setPassword2]= useState("");

    // take username from user
    function handleUsernameChange(event){
        setUsername(event.target.value)
    }
    function handleRealNameChange(event){
        setRealName(event.target.value)
    }
    function handlePassword1Change(event){
        setPassword1(event.target.value)
    }
    function handlePassword2Change(event){
        setPassword2(event.target.value)
    }


    return(<>
    <h1 className="registration-header">Please enter your information below.</h1>
    <div className="registration-input">
        <input 
        value={username}
        onChange={handleUsernameChange} 
        type="text" 
        placeholder="Username"/>
        <input 
        className="registration-input"
        value={realName}
        onChange={handleRealNameChange}
        type="text"
        placeholder="Real name"/>
        <input
        className="registration-input"
        value={password1}
        onChange={handlePassword1Change}
        type="text"
        placeholder="password"/>
        <input
        className="registration-input"
        value={password2}
        onChange={handlePassword2Change}
        type="text"
        placeholder="Re-enter your password"/>
    </div>
<div className="password-match-indicator">
  <div
    className="indicator-circle"
    style={{
      backgroundColor:
        password1 && password2
          ? password1 === password2
            ? "green"
            : "red"
          : "gray",
    }}
  ></div>
  <span className="indicator-message">
    {password1 && password2
      ? password1 === password2
        ? "Passwords match"
        : "Passwords do not match"
      : "Enter both passwords"}
  </span>
</div>
    </>)
}