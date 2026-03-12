import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile(){

const { logout } = useAuth();
const navigate = useNavigate();

const [profile,setProfile] = useState({});
const [preview,setPreview] = useState(null);
const [loading,setLoading] = useState(true);

useEffect(()=>{
fetchProfile();
},[]);

const fetchProfile = async ()=>{

const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/api/profile",{
headers:{
Authorization:`Bearer ${token}`
}
});

const data = await res.json();

setProfile(data);
setLoading(false);

};

const handleImageChange = async (e)=>{

const file = e.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onloadend = async ()=>{

const base64Image = reader.result;

setPreview(base64Image);

const token = localStorage.getItem("token");

await fetch("http://localhost:5000/api/profile",{

method:"PUT",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
...profile,
profileImage:base64Image
})

});

fetchProfile();

};

reader.readAsDataURL(file);

};

const handleChange = (e)=>{

setProfile({
...profile,
[e.target.name]:e.target.value
});

};

const handleSave = async ()=>{

const token = localStorage.getItem("token");

await fetch("http://localhost:5000/api/profile",{

method:"PUT",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify(profile)

});

alert("Profile Updated Successfully");

};

const handleLogout = ()=>{
logout();
navigate("/login");
};

if(loading){
return <h2 style={{textAlign:"center"}}>Loading Profile...</h2>
}

return(

<div>

<Header/>

<div className="profile-page">

<div className="profile-card">

<div className="profile-left">

<img
className="profile-avatar"
src={
preview ||
profile?.profileImage ||
"https://cdn-icons-png.flaticon.com/512/149/149071.png"
}
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

<h3>{profile?.name}</h3>

<p className="email">{profile?.email}</p>

<button className="logout-btn" onClick={handleLogout}>
Logout
</button>

</div>

<div className="profile-right">

<h2>Profile Information</h2>

<input
name="name"
value={profile?.name || ""}
onChange={handleChange}
placeholder="Full Name"
/>

<input
name="email"
value={profile?.email || ""}
onChange={handleChange}
placeholder="Email"
/>

<input
name="phone"
value={profile?.phone || ""}
onChange={handleChange}
placeholder="Phone Number"
/>

<textarea
name="about"
value={profile?.about || ""}
onChange={handleChange}
placeholder="About yourself"
/>

<button className="save-btn" onClick={handleSave}>
Save Changes
</button>

<div className="stats">

<div className="stat-box">
<h3>Photos</h3>
<p>Your uploaded photos</p>
</div>

<div className="stat-box">

<h3>
{profile?.createdAt
? new Date(profile.createdAt).getFullYear()
: "--"}
</h3>

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