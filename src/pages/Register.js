import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Register.css";

function Register(){

const navigate = useNavigate();

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [phone,setPhone] = useState("");
const [password,setPassword] = useState("");
const [showPassword,setShowPassword] = useState(false);
const [error,setError] = useState("");

const validateEmail = (email)=>{
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password)=>{
return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password);
};

const handleRegister = (e)=>{
e.preventDefault();

if(name.trim()===""){
setError("Please enter your name");
return;
}

if(!validateEmail(email)){
setError("Enter a valid email format");
return;
}

if(phone.trim()===""){
setError("Please enter phone number");
return;
}

if(!validatePassword(password)){
setError("Password must contain 6 characters, 1 uppercase, 1 number, 1 special character");
return;
}

const users = JSON.parse(localStorage.getItem("users")) || [];

const userExists = users.find((user)=>user.email===email);

if(userExists){
setError("Email already registered. Please login.");
return;
}

const newUser = { name,email,phone,password };

users.push(newUser);

localStorage.setItem("users",JSON.stringify(users));

toast.success("Account created successfully");

navigate("/login");
};

return(

<div>

<Header/>

<div className="register-page">

<div className="register-container">

<div className="register-image">

<img
src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7865.jpg"
alt="register"
/>

</div>

<div className="register-form">

<h2>Create Account</h2>

<form onSubmit={handleRegister}>

<input
type="text"
placeholder="Name"
value={name}
onChange={(e)=>{
setName(e.target.value);
setError("");
}}
required
/>

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

<input
type="text"
placeholder="Phone Number"
value={phone}
onChange={(e)=>{
setPhone(e.target.value);
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
Register
</button>

</form>

{error && <p className="error-msg">{error}</p>}

<p className="login-link">
Already have an account? <Link to="/login">Login</Link>
</p>

</div>

</div>

</div>

<Footer/>

</div>

);

}

export default Register;