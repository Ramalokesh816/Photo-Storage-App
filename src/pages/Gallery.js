import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Gallery.css";

function Gallery(){

const [photos,setPhotos] = useState([]);
const [selectedMedia,setSelectedMedia] = useState(null);
const [selectedType,setSelectedType] = useState(null);
const [selectedIndex,setSelectedIndex] = useState(null);
const [selectedAlbum,setSelectedAlbum] = useState("All");
const [loading,setLoading] = useState(true);

/* NEW STATES */

const [zoom,setZoom] = useState(1);
const [touchStart,setTouchStart] = useState(null);
const [touchEnd,setTouchEnd] = useState(null);

/* ================================
   FETCH PHOTOS
================================ */

useEffect(()=>{
fetchPhotos();
},[]);

const fetchPhotos = async()=>{

try{

const token = localStorage.getItem("token");

const res = await fetch(
"https://photo-storage-app.onrender.com/api/photos",
{
headers:{
Authorization:`Bearer ${token}`
}
});

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

const res = await fetch(
`https://photo-storage-app.onrender.com/api/photos/${id}`,
{
method:"DELETE",
headers:{
Authorization:`Bearer ${token}`
}
});

if(!res.ok){
throw new Error("Delete failed");
}

setPhotos(prev=>prev.filter(photo=>photo._id !== id));

toast.success("Photo deleted");

}catch(error){

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
   OPEN MEDIA
================================ */

const openMedia = (url,type,index)=>{
setSelectedMedia(url);
setSelectedType(type);
setSelectedIndex(index);
setZoom(1);
};

/* ================================
   NEXT MEDIA
================================ */

const nextMedia = (e)=>{
e.stopPropagation();

const nextIndex =
(selectedIndex + 1) % filteredPhotos.length;

setSelectedIndex(nextIndex);
setSelectedMedia(filteredPhotos[nextIndex].imageUrl);
setSelectedType(filteredPhotos[nextIndex].mediaType);
setZoom(1);
};

/* ================================
   PREVIOUS MEDIA
================================ */

const prevMedia = (e)=>{
e.stopPropagation();

const prevIndex =
(selectedIndex - 1 + filteredPhotos.length) %
filteredPhotos.length;

setSelectedIndex(prevIndex);
setSelectedMedia(filteredPhotos[prevIndex].imageUrl);
setSelectedType(filteredPhotos[prevIndex].mediaType);
setZoom(1);
};

/* ================================
   IMAGE ZOOM
================================ */

const handleZoom = (e)=>{

if(selectedType !== "image") return;

e.preventDefault();

if(e.deltaY < 0){
setZoom(prev => Math.min(prev + 0.2,3));
}else{
setZoom(prev => Math.max(prev - 0.2,1));
}

};

/* ================================
   MOBILE SWIPE
================================ */

const handleTouchStart = (e)=>{
setTouchStart(e.targetTouches[0].clientX);
};

const handleTouchMove = (e)=>{
setTouchEnd(e.targetTouches[0].clientX);
};

const handleTouchEnd = ()=>{

if(!touchStart || !touchEnd) return;

const distance = touchStart - touchEnd;

if(distance > 50){
nextMedia({stopPropagation:()=>{}});
}

if(distance < -50){
prevMedia({stopPropagation:()=>{}});
}

setTouchStart(null);
setTouchEnd(null);

};

/* ================================
   LOADING
================================ */

if(loading){

return(
<div>
<Header/>
<div className="loading">
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

<div className="gallery-page">

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

{photo.mediaType === "video" ? (

<video
className="media-item"
onClick={()=>openMedia(photo.imageUrl,"video",index)}
>
<source src={photo.imageUrl}/>
</video>

) : (

<img
className="media-item"
src={photo.imageUrl}
alt="gallery"
onClick={()=>openMedia(photo.imageUrl,"image",index)}
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

{/* =========================
   MODAL VIEW
========================= */}

{selectedMedia && (

<div
className="modal"
onClick={()=>setSelectedMedia(null)}
onWheel={handleZoom}
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
>

<button className="arrow left" onClick={prevMedia}>
❮
</button>

{selectedType === "video" ? (

<video
controls
playsInline
preload="metadata"
className="modal-video"
onClick={(e)=>e.stopPropagation()}
>
<source src={selectedMedia} type="application/x-mpegURL" />
</video>

) : (

<img
src={selectedMedia}
alt="large"
className="modal-image"
style={{
transform:`scale(${zoom})`,
transition:"transform 0.2s"
}}
onClick={(e)=>e.stopPropagation()}
/>

)}

<button className="arrow right" onClick={nextMedia}>
❯
</button>

</div>

)}

<Footer/>

</div>

);

}

export default Gallery;