import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
const [photoCount,setPhotoCount] = useState(0);
const [loading,setLoading] = useState(true);
const [editing,setEditing] = useState(false);

/* ============================
   LOAD PROFILE + PHOTO COUNT
============================ */

useEffect(()=>{
fetchProfile();
fetchPhotoCount();
},[]);

const fetchProfile = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await fetch("https://photo-storage-app.onrender.com/api/profile",{
headers:{
Authorization:`Bearer ${token}`
}
});

const data = await res.json();

setProfile(data);
setLoading(false);

}catch(error){
console.log(error);
toast.error("Failed to load profile");
}

};

const fetchPhotoCount = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await fetch("https://photo-storage-app.onrender.com/api/photos",{
headers:{
Authorization:`Bearer ${token}`
}
});

const data = await res.json();

setPhotoCount(data.length);

}catch(error){
console.log(error);
}

};

/* ============================
   PROFILE IMAGE UPLOAD
============================ */

const handleImageChange = async (e)=>{

const file = e.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onloadend = async ()=>{

const base64Image = reader.result;

setPreview(base64Image);

try{

const token = localStorage.getItem("token");

await fetch("https://photo-storage-app.onrender.com/api/profile",{

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
toast.success("Profile image updated");

}catch(error){
console.log(error);
toast.error("Image upload failed");
}

};

reader.readAsDataURL(file);

};

/* ============================
   INPUT CHANGE
============================ */

const handleChange = (e)=>{

setProfile({
...profile,
[e.target.name]:e.target.value
});

};

/* ============================
   SAVE PROFILE
============================ */

const handleSave = async ()=>{

try{

const token = localStorage.getItem("token");

await fetch("hhttps://photo-storage-app.onrender.com/api/profile",{

method:"PUT",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify(profile)

});

toast.success("Profile updated successfully");

setEditing(false);

fetchProfile();

}catch(error){

toast.error("Update failed");

}

};

/* ============================
   LOGOUT
============================ */

const handleLogout = ()=>{

logout();
navigate("/login");

};

if(loading){

return(
<div style={{textAlign:"center",marginTop:"100px"}}>
<h2>Loading Profile...</h2>
</div>
);

}

/* ============================
   UI
============================ */

return(

<div>

<Header/>

<div className="profile-page">

<div className="profile-card">

{/* LEFT PANEL */}

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

{/* RIGHT PANEL */}

<div className="profile-right">

<h2>Profile Information</h2>

<input
name="name"
value={profile?.name || ""}
onChange={handleChange}
placeholder="Full Name"
disabled={!editing}
/>

<input
name="email"
value={profile?.email || ""}
onChange={handleChange}
placeholder="Email"
disabled={!editing}
/>

<input
name="phone"
value={profile?.phone || ""}
onChange={handleChange}
placeholder="Phone Number"
disabled={!editing}
/>

<textarea
name="about"
value={profile?.about || ""}
onChange={handleChange}
placeholder="About yourself"
disabled={!editing}
/>

{/* EDIT / SAVE BUTTON */}

{editing ? (

<button className="save-btn" onClick={handleSave}>
Save Changes
</button>

) : (

<button
className="edit-btn"
onClick={()=>setEditing(true)}
>
Edit Profile
</button>

)}

{/* USER STATS */}

<div className="stats">

<div className="stat-box">

<h3>{photoCount}</h3>

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