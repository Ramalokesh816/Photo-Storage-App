import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";
import logo from "../components/logo.png";

function Header(){

const { user, logout } = useAuth();

const [dropdownOpen,setDropdownOpen] = useState(false);
const [darkMode,setDarkMode] = useState(false);
const [menuOpen,setMenuOpen] = useState(false);

/* =========================
   DARK MODE
========================= */

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

{/* LOGO */}

<Link to="/" className="logo">

<img src={logo} alt="Vedha Memories Logo"/>

<span>Vedha Memories</span>

</Link>

{/* HAMBURGER BUTTON */}

<div 
className="hamburger"
onClick={()=>setMenuOpen(!menuOpen)}
>
☰
</div>

{/* NAVIGATION */}

<nav className={menuOpen ? "nav active" : "nav"}>

<Link to="/" onClick={()=>setMenuOpen(false)}>Home</Link>

{user && <Link to="/gallery" onClick={()=>setMenuOpen(false)}>Gallery</Link>}
{user && <Link to="/upload" onClick={()=>setMenuOpen(false)}>Upload</Link>}
{user && <Link to="/dashboard" onClick={()=>setMenuOpen(false)}>Dashboard</Link>}
{!user && <Link to="/login" onClick={()=>setMenuOpen(false)}>Login</Link>}
{!user && <Link to="/register" onClick={()=>setMenuOpen(false)}>Register</Link>}

{/* DARK MODE BUTTON */}

<button
className="dark-btn"
onClick={()=>setDarkMode(!darkMode)}
>
{darkMode ? "☀️" : "🌙"}
</button>

{/* PROFILE MENU */}

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