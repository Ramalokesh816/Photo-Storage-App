import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Gallery.css";

function Gallery() {

const [photos,setPhotos] = useState([]);
const [selectedImage,setSelectedImage] = useState(null);
const [selectedIndex,setSelectedIndex] = useState(null);
const [selectedAlbum,setSelectedAlbum] = useState("All");
const [loading,setLoading] = useState(true);

/* ================================
   FETCH PHOTOS FROM BACKEND
================================ */

useEffect(()=>{
fetchPhotos();
},[]);

const fetchPhotos = async () => {

try{

const token = localStorage.getItem("token");

const res = await fetch("https://photo-storage-app.onrender.com/api/photos",{
headers:{
Authorization:`Bearer ${token}`
}
});

if(!res.ok){
throw new Error("Failed to fetch photos");
}

const data = await res.json();

setPhotos(data);

}catch(error){

console.log(error);
toast.error("Failed to load gallery");

}

setLoading(false);

};

/* ================================
   DELETE PHOTO
================================ */

const deletePhoto = async(id)=>{

try{

const token = localStorage.getItem("token");

const res = await fetch(`https://photo-storage-app.onrender.com/api/photos/${id}`,{
method:"DELETE",
headers:{
Authorization:`Bearer ${token}`
}
});

if(!res.ok){
throw new Error("Delete failed");
}

setPhotos(prev => prev.filter(photo => photo._id !== id));

toast.success("Photo deleted 🗑");

}catch(error){

console.log(error);
toast.error("Delete failed");

}

};

/* ================================
   FILTER ALBUM
================================ */

const filteredPhotos =
selectedAlbum === "All"
? photos
: photos.filter(photo =>
photo.album?.toLowerCase() === selectedAlbum.toLowerCase()
);

/* ================================
   IMAGE NAVIGATION
================================ */

const openImage = (url,index)=>{
setSelectedImage(url);
setSelectedIndex(index);
};

const nextImage = (e)=>{
e.stopPropagation();

if(selectedIndex === null) return;

const nextIndex = (selectedIndex + 1) % filteredPhotos.length;

setSelectedIndex(nextIndex);
setSelectedImage(filteredPhotos[nextIndex].imageUrl);
};

const prevImage = (e)=>{
e.stopPropagation();

if(selectedIndex === null) return;

const prevIndex =
(selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length;

setSelectedIndex(prevIndex);
setSelectedImage(filteredPhotos[prevIndex].imageUrl);
};

/* ================================
   LOADING SCREEN
================================ */

if(loading){

return(
<div>
<Header/>
<div style={{textAlign:"center",marginTop:"120px"}}>
<h2>Loading gallery...</h2>
</div>
<Footer/>
</div>
);

}

/* ================================
   UI
================================ */

return(

<div>

<Header/>

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
<div className="photo-card" key={photo._id}>

{/* VIDEO */}

{photo.mediaType === "video" ? (

<video className="media-item" controls>
<source src={photo.imageUrl} />
</video>

) : (

<img
className="media-item"
src={photo.imageUrl}
alt="gallery"
onClick={()=>openImage(photo.imageUrl,index)}
/>

)}

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

{/* FULLSCREEN IMAGE */}

{selectedImage && (

<div
className="modal"
onClick={()=>setSelectedImage(null)}
>

<button className="arrow left" onClick={prevImage}>
❮
</button>

<img src={selectedImage} alt="large"/>

<button className="arrow right" onClick={nextImage}>
❯
</button>

</div>

)}

<Footer/>

</div>

);

}

export default Gallery;