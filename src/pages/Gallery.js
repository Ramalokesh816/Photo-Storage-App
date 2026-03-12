import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Gallery.css";

function Gallery(){

const [photos,setPhotos] = useState([]);
const [selectedImage,setSelectedImage] = useState(null);
const [selectedAlbum,setSelectedAlbum] = useState("All");

useEffect(()=>{

const storedImages =
JSON.parse(localStorage.getItem("photos")) || [];

setPhotos(storedImages);

},[]);

const deletePhoto = (index)=>{

const updatedPhotos = [...photos];

updatedPhotos.splice(index,1);

setPhotos(updatedPhotos);

localStorage.setItem("photos",JSON.stringify(updatedPhotos));

};

const filteredPhotos =
selectedAlbum === "All"
? photos
: photos.filter(photo => photo.album === selectedAlbum);

return(

<div>
<Header />
<div className="gallery">

<h2>Your Photo Gallery</h2>

<select
className="album-filter"
value={selectedAlbum}
onChange={(e)=>setSelectedAlbum(e.target.value)}
>

<option value="All">All</option>
<option value="General">General</option>
<option value="Vacation">Vacation</option>
<option value="Family">Family</option>
<option value="Friends">Friends</option>
<option value="Work">Work</option>

</select>

<div className="gallery-grid">

{filteredPhotos.length === 0 ? (

<p>No photos uploaded yet</p>

) : (

filteredPhotos.map((photo,index)=>(
<div className="photo-card" key={index}>

<img
src={photo.image}
alt="gallery"
onClick={()=>setSelectedImage(photo.image)}
/>

<button
className="delete-btn"
onClick={()=>deletePhoto(index)}
>
Delete
</button>

</div>
))

)}

</div>

</div>

{/* FULLSCREEN VIEW */}

{selectedImage && (

<div
className="modal"
onClick={()=>setSelectedImage(null)}
>

<img src={selectedImage} alt="large"/>

</div>

)}

<Footer/>

</div>

);

}

export default Gallery;