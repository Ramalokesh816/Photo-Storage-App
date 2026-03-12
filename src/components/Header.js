import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

function Header(){

const { user, logout } = useAuth();

const [dropdownOpen,setDropdownOpen] = useState(false);
const [darkMode,setDarkMode] = useState(false);

// Dark mode effect
useEffect(()=>{

const savedMode = localStorage.getItem("darkMode");

if(savedMode === "true"){
setDarkMode(true);
document.body.classList.add("dark-mode");
}

},[]);

useEffect(()=>{

if(darkMode){
document.body.classList.add("dark-mode");
localStorage.setItem("darkMode",true);
}else{
document.body.classList.remove("dark-mode");
localStorage.setItem("darkMode",false);
}

},[darkMode]);

return(

<header className="header">

<h2 className="logo">PhotoVault</h2>

<nav className="nav">

<Link to="/">Home</Link>

{user && <Link to="/gallery">Gallery</Link>}
{user && <Link to="/upload">Upload</Link>}

{!user && <Link to="/login">Login</Link>}
{!user && <Link to="/register">Register</Link>}

{/* Dark Mode Toggle */}

<button
className="dark-btn"
onClick={()=>setDarkMode(!darkMode)}
>

{darkMode ? "☀️" : "🌙"}

</button>

{user && (

<div className="profile-menu">

<div
className="profile-icon"
onClick={()=>setDropdownOpen(!dropdownOpen)}
>
👤
</div>

{dropdownOpen && (

<div className="dropdown">

<Link to="/profile">My Profile</Link>

<button onClick={logout}>
Logout
</button>

</div>

)}

</div>

)}

</nav>

</header>

);

}

export default Header;