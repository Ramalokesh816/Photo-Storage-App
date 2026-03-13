import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Home.css";

function Home(){

const [photos,setPhotos] = useState([]);
const [selectedMedia,setSelectedMedia] = useState(null);
const [loading,setLoading] = useState(true);

useEffect(()=>{
fetchPhotos();
},[]);

const fetchPhotos = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await fetch("https://photo-storage-app.onrender.com/api/photos",{
headers:{
Authorization:`Bearer ${token}`
}
});

// Handle unauthorized response
if(res.status === 401){
console.log("Unauthorized - login required");
setPhotos([]);
setLoading(false);
return;
}

const data = await res.json();

// Ensure data is an array
if(Array.isArray(data)){
setPhotos(data);
}else{
console.log("API returned non-array:", data);
setPhotos([]);
}

}catch(error){

console.error("Failed to load photos",error);
setPhotos([]);

}

setLoading(false);

};

// Safe slice
const recentPhotos = Array.isArray(photos) ? photos.slice(-4).reverse() : [];

return(

<div>

<Header/>

{/* HERO SECTION */}

<section className="hero">

<div className="hero-overlay">

<div className="hero-content">

<h1>Store Your Memories Safely</h1>

<p>
Upload, organize and access your photos and videos anytime from anywhere.
</p>

<Link to="/upload" className="hero-btn">
Start Uploading
</Link>

</div>

</div>

</section>


{/* DASHBOARD */}

<section className="dashboard">

<div className="card">

<h3>Total Media</h3>

<p className="count">
{photos.length}
</p>

</div>

<div className="card">

<h3>Quick Upload</h3>

<Link to="/upload" className="upload-btn">
Upload Media
</Link>

</div>

</section>


{/* RECENT UPLOADS */}

<section className="recent-section">

<h2>Recent Uploads</h2>

<div className="recent-grid">

{loading ? (

<p>Loading media...</p>

) : recentPhotos.length === 0 ? (

<p>No media uploaded yet</p>

) : (

recentPhotos.map((photo)=>(

<div key={photo._id} className="recent-card">

{photo.mediaType === "image" ? (

<img
src={photo.imageUrl}
alt="recent"
onClick={()=>setSelectedMedia(photo)}
/>

) : (

<video
controls
onClick={()=>setSelectedMedia(photo)}
>
<source src={photo.imageUrl} type="video/mp4"/>
</video>

)}

</div>

))

)}

</div>

</section>


{/* FULLSCREEN VIEW */}

{selectedMedia && (

<div
className="modal"
onClick={()=>setSelectedMedia(null)}
>

{selectedMedia.mediaType === "image" ? (

<img src={selectedMedia.imageUrl} alt="large"/>

) : (

<video controls autoPlay>
<source src={selectedMedia.imageUrl} type="video/mp4"/>
</video>

)}

</div>

)}


{/* FEATURES */}

<section className="features">

<h2>Why Use PhotoVault?</h2>

<div className="feature-grid">

<div className="feature-card">
<img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" alt="secure"/>
<h3>Secure Storage</h3>
<p>Your photos and videos are safely stored in one place.</p>
</div>

<div className="feature-card">
<img src="https://images.unsplash.com/photo-1492724441997-5dc865305da7" alt="gallery"/>
<h3>Beautiful Gallery</h3>
<p>View your media in a clean gallery layout.</p>
</div>

<div className="feature-card">
<img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2" alt="mobile"/>
<h3>Mobile Friendly</h3>
<p>Access your media anytime on any device.</p>
</div>

</div>

</section>

<Footer/>

</div>

);

}

export default Home;