import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Hls from "hls.js";

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

const [zoom,setZoom] = useState(1);

const [touchStart,setTouchStart] = useState(null);
const [touchEnd,setTouchEnd] = useState(null);

const videoRef = useRef(null);

/* ================= FETCH ================= */

useEffect(()=>{
fetchPhotos();
},[]);

const fetchPhotos = async()=>{

try{

const token = localStorage.getItem("token");

const res = await fetch(
"https://photo-storage-app.onrender.com/api/photos",
{
headers:{Authorization:`Bearer ${token}`}
});

if(!res.ok) throw new Error();

const data = await res.json();

setPhotos(data);

}catch{

toast.error("Failed to load gallery");

}

setLoading(false);

};

/* ================= DELETE ================= */

const deletePhoto = async(id)=>{

try{

const token = localStorage.getItem("token");

const res = await fetch(
`https://photo-storage-app.onrender.com/api/photos/${id}`,
{
method:"DELETE",
headers:{Authorization:`Bearer ${token}`}
});

if(!res.ok) throw new Error();

setPhotos(prev=>prev.filter(photo=>photo._id!==id));

toast.success("Photo deleted");

}catch{

toast.error("Delete failed");

}

};

/* ================= FILTER ================= */

const filteredPhotos =
selectedAlbum==="All"
? photos
: photos.filter(p=>p.album?.toLowerCase()===selectedAlbum.toLowerCase());

/* ================= OPEN ================= */

const openMedia=(url,type,index)=>{
setSelectedMedia(url);
setSelectedType(type);
setSelectedIndex(index);
setZoom(1);
};

/* ================= NEXT ================= */

const nextMedia=(e)=>{
e.stopPropagation();

const nextIndex=(selectedIndex+1)%filteredPhotos.length;

setSelectedIndex(nextIndex);
setSelectedMedia(filteredPhotos[nextIndex].imageUrl);
setSelectedType(filteredPhotos[nextIndex].mediaType);
};

/* ================= PREVIOUS ================= */

const prevMedia=(e)=>{
e.stopPropagation();

const prevIndex=(selectedIndex-1+filteredPhotos.length)%filteredPhotos.length;

setSelectedIndex(prevIndex);
setSelectedMedia(filteredPhotos[prevIndex].imageUrl);
setSelectedType(filteredPhotos[prevIndex].mediaType);
};

/* ================= ZOOM ================= */

const toggleZoom=()=>{
if(selectedType!=="image") return;
setZoom(prev=>prev===1?2:1);
};

/* ================= SWIPE ================= */

const handleTouchStart=(e)=>{
setTouchStart(e.touches[0].clientX);
};

const handleTouchMove=(e)=>{
setTouchEnd(e.touches[0].clientX);
};

const handleTouchEnd=()=>{

if(!touchStart||!touchEnd) return;

const distance=touchStart-touchEnd;

if(distance>50){
nextMedia({stopPropagation:()=>{}});
}

if(distance<-50){
prevMedia({stopPropagation:()=>{}});
}

setTouchStart(null);
setTouchEnd(null);

};

/* ================= HLS STREAMING ================= */

useEffect(()=>{

if(selectedMedia && selectedType==="video"){

const video = videoRef.current;

if(!video) return;

const hlsUrl =
selectedMedia.replace(".mp4",".m3u8").replace("/upload/","/upload/sp_full_hd/");

if(Hls.isSupported()){

const hls = new Hls({
maxBufferLength:10,
maxMaxBufferLength:20,
enableWorker:true
});

hls.loadSource(hlsUrl);

hls.attachMedia(video);

hls.on(Hls.Events.MANIFEST_PARSED,()=>{
video.play().catch(()=>{});
});

}else if(video.canPlayType("application/vnd.apple.mpegurl")){

video.src = hlsUrl;

}

}

},[selectedMedia]);

/* ================= LOADING ================= */

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

/* ================= UI ================= */

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

{filteredPhotos.map((photo,index)=>(

<div className="photo-card" key={photo._id}>

{photo.mediaType==="video"?(
<video
className="media-item"
onClick={()=>openMedia(photo.imageUrl,"video",index)}
>
<source src={photo.imageUrl}/>
</video>
):(
<img
className="media-item"
src={photo.imageUrl}
alt="gallery"
onClick={()=>openMedia(photo.imageUrl,"image",index)}
/>
)}

<button
className="delete-btn"
onClick={(e)=>{
e.stopPropagation();
deletePhoto(photo._id);
}}
>
Delete
</button>

</div>

))}

</div>

</div>

{/* ================= MODAL ================= */}

{selectedMedia&&(

<div
className="modal"
onClick={()=>setSelectedMedia(null)}
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
>

<button className="arrow left" onClick={prevMedia}>❮</button>

{selectedType==="video"?(
<video
ref={videoRef}
controls
playsInline
preload="metadata"
className="modal-video"
onClick={(e)=>e.stopPropagation()}
/>
):(
<img
src={selectedMedia}
alt="large"
className="modal-image"
style={{transform:`scale(${zoom})`}}
onClick={(e)=>e.stopPropagation()}
onDoubleClick={toggleZoom}
/>
)}

<button className="arrow right" onClick={nextMedia}>❯</button>

</div>

)}

<Footer/>

</div>

);

}

export default Gallery;