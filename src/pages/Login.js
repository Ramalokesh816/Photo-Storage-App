import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Login.css";

function Login(){

const navigate = useNavigate();
const { login, user } = useAuth();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [showPassword,setShowPassword] = useState(false);
const [error,setError] = useState("");

useEffect(()=>{
if(user){
navigate("/");
}
},[user,navigate]);

const validateEmail = (email)=>{
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleLogin = (e)=>{
e.preventDefault();

if(!validateEmail(email)){
setError("Enter a valid email format (example@email.com)");
return;
}

if(password.length < 4){
setError("Password must contain at least 4 characters");
return;
}

const registeredUsers =
JSON.parse(localStorage.getItem("users")) || [];

const userExists = registeredUsers.find(
(user)=> user.email === email && user.password === password
);

if(!userExists){
toast.error("Invalid email or password");
return;
}

login(userExists.email);

toast.success("Login successful");

navigate("/");
}

return(

<div>

<Header/>

<div className="login-page">

<div className="login-container">

<div className="login-image">

<img
src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7865.jpg"
alt="login"
/>

</div>

<div className="login-form">

<h2>Login to PhotoVault</h2>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>{
setEmail(e.target.value);
setError("");
}}
required
/>

<div className="password-field">

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e)=>{
setPassword(e.target.value);
setError("");
}}
required
/>

<span
className="eye-icon"
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? "🙈" : "👁"}
</span>

</div>

<button type="submit">
Login
</button>

</form>

{error && <p className="error-msg">{error}</p>}

<p className="register-link">
Don't have an account? <Link to="/register">Register</Link>
</p>

<div className="login-rules">

<h4>Login Rules</h4>

<ul>
<li>Enter valid email format</li>
<li>Email must be registered</li>
<li>Password must match registered account</li>
</ul>

</div>

</div>

</div>

</div>

<Footer/>

</div>

);

}

export default Login;