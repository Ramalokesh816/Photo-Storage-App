import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Gallery.css";

function Gallery(){

const [photos,setPhotos] = useState([]);
const [selectedImage,setSelectedImage] = useState(null);
const [selectedAlbum,setSelectedAlbum] = useState("All");

useEffect(()=>{

fetch("http://localhost:5000/api/photos")
.then(res => res.json())
.then(data => setPhotos(data))
.catch(err => console.log(err));

},[]);

const deletePhoto = async (id) => {

try{

await fetch(`http://localhost:5000/api/photos/${id}`,{
method:"DELETE"
});

setPhotos(photos.filter(photo => photo._id !== id));

}catch(error){

console.log(error);

}

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
src={photo.imageUrl}
alt="gallery"
onClick={()=>setSelectedImage(photo.imageUrl)}
/>

<button
className="delete-btn"
onClick={()=>deletePhoto(photo._id)}
>
Delete
</button>

</div>

))

)}

</div>

</div>

{/* FULLSCREEN IMAGE VIEW */}

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