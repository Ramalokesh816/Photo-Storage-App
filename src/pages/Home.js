import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Home.css";

function Home(){

const [photos,setPhotos] = useState([]);
const [selectedImage,setSelectedImage] = useState(null);

useEffect(()=>{

const storedPhotos =
JSON.parse(localStorage.getItem("photos")) || [];

setPhotos(storedPhotos);

},[]);

const recentPhotos = photos.slice(-4).reverse();

return(

<div>

<Header/>

{/* HERO SECTION */}

<section className="hero">

<div className="hero-overlay">

<div className="hero-content">

<h1>Store Your Memories Safely</h1>

<p>
Upload, organize and access your photos anytime from anywhere.
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

<h3>Total Photos</h3>

<p className="count">
{photos.length}
</p>

</div>

<div className="card">

<h3>Quick Upload</h3>

<Link to="/upload" className="upload-btn">
Upload Photo
</Link>

</div>

</section>

{/* RECENT UPLOADS */}

<section className="recent-section">

<h2>Recent Uploads</h2>

<div className="recent-grid">

{recentPhotos.length === 0 ? (

<p>No photos uploaded yet</p>

) : (

recentPhotos.map((photo,index)=>(

<img
key={index}
src={photo.image}
alt="recent"
onClick={()=>setSelectedImage(photo.image)}
/>

))

)}

</div>

</section>

{/* FULLSCREEN VIEW */}

{selectedImage && (

<div
className="modal"
onClick={()=>setSelectedImage(null)}
>

<img src={selectedImage} alt="large"/>

</div>

)}

{/* FEATURES */}

<section className="features">

<h2>Why Use PhotoVault?</h2>

<div className="feature-grid">

<div className="feature-card">
<img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" alt="secure"/>
<h3>Secure Storage</h3>
<p>Your photos are safely stored in one place.</p>
</div>

<div className="feature-card">
<img src="https://images.unsplash.com/photo-1492724441997-5dc865305da7" alt="gallery"/>
<h3>Beautiful Gallery</h3>
<p>View your photos in a clean gallery layout.</p>
</div>

<div className="feature-card">
<img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2" alt="mobile"/>
<h3>Mobile Friendly</h3>
<p>Access your photos anytime on any device.</p>
</div>

</div>

</section>

<Footer/>

</div>

);

}

export default Home;