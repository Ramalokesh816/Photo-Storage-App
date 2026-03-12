import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile(){

const { logout, user } = useAuth();
const navigate = useNavigate();

const [preview,setPreview] = useState(null);

const handleImageChange = (e)=>{
const file = e.target.files[0];

if(file){
setPreview(URL.createObjectURL(file));
}
};

const handleLogout = ()=>{
logout();
navigate("/login");
};

return(

<div>

<Header/>

<div className="profile-page">

<div className="profile-card">

<div className="profile-left">

<img
className="profile-avatar"
src={preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
alt="profile"
/>

<label className="upload-btn">
Upload Photo
<input
type="file"
accept="image/*"
onChange={handleImageChange}
hidden
/>
</label>

<h3>{user?.name || "User"}</h3>
<p className="email">{user?.email || "user@email.com"}</p>

<button className="logout-btn" onClick={handleLogout}>
Logout
</button>

</div>

<div className="profile-right">

<h2>Profile Information</h2>

<input type="text" placeholder="Full Name"/>

<input type="email" placeholder="Email"/>

<input type="text" placeholder="Phone Number"/>

<textarea placeholder="About yourself"></textarea>

<button className="save-btn">
Save Changes
</button>

<div className="stats">

<div className="stat-box">
<h3>45</h3>
<p>Photos Uploaded</p>
</div>

<div className="stat-box">
<h3>2026</h3>
<p>Member Since</p>
</div>

</div>

</div>

</div>

</div>

<Footer/>

</div>

);

}

export default Profile;