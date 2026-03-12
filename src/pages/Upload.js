import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Header from "../components/Header";
import imageCompression from "browser-image-compression";

import {
DndContext,
closestCenter
} from "@dnd-kit/core";

import {
SortableContext,
useSortable,
arrayMove,
rectSortingStrategy
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import "../styles/Upload.css";

function SortableItem({ id, preview, removeImage }) {

const {
attributes,
listeners,
setNodeRef,
transform,
transition
} = useSortable({ id });

const style = {
transform: CSS.Transform.toString(transform),
transition
};

return (

<div
ref={setNodeRef}
style={style}
className="preview-item"
>

<div {...attributes} {...listeners}>

<img src={preview} alt="preview" />

</div>

<button
type="button"
className="remove-btn"
onPointerDown={(e)=>e.stopPropagation()}
onClick={(e)=>{
e.preventDefault();
removeImage(id);
}}
>
✕
</button>

</div>

);

}

function Upload(){

const [images,setImages] = useState([]);
const [progress,setProgress] = useState(0);
const [album,setAlbum] = useState("General");


// Load images after refresh
useEffect(()=>{

const savedImages = localStorage.getItem("uploadImages");

if(savedImages){
setImages(JSON.parse(savedImages));
}

},[]);


// Save images whenever they change
useEffect(()=>{

localStorage.setItem("uploadImages", JSON.stringify(images));

},[images]);


const onDrop = (acceptedFiles)=>{

const newItems = acceptedFiles.map(file => ({
id: Date.now() + Math.random(),
file: file,
preview: URL.createObjectURL(file)
}));

setImages(prev => [...prev,...newItems]);

};

const { getRootProps,getInputProps,isDragActive } = useDropzone({
onDrop,
accept:{"image/*":[]},
multiple:true
});


const removeImage = (id)=>{

setImages(prev => prev.filter(img => img.id !== id));

};


const handleDragEnd = (event)=>{

const {active,over} = event;

if(!over) return;

if(active.id !== over.id){

const oldIndex = images.findIndex(img => img.id === active.id);
const newIndex = images.findIndex(img => img.id === over.id);

setImages(items => arrayMove(items,oldIndex,newIndex));

}

};


const convertToBase64 = (file)=>{

return new Promise(resolve=>{

const reader = new FileReader();

reader.onloadend = ()=> resolve(reader.result);

reader.readAsDataURL(file);

});

};


const handleUpload = async ()=>{

if(images.length === 0){
alert("Please select images");
return;
}

let uploaded = 0;

for(const item of images){

const compressed = await imageCompression(item.file,{
maxSizeMB:1,
maxWidthOrHeight:1200,
useWebWorker:true
});

const base64Image = await convertToBase64(compressed);

await fetch("http://localhost:5000/api/upload",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
title:"Photo",
imageUrl:base64Image,
album:album
})
});

uploaded++;

setProgress(Math.round((uploaded/images.length)*100));

}

alert("Images uploaded successfully!");

setImages([]);
setProgress(0);

localStorage.removeItem("uploadImages");

};


return(

<div>

<Header/>

<div className="upload-page">

<div className="upload-container">

<h2>Upload Your Photos</h2>

<select
value={album}
onChange={(e)=>setAlbum(e.target.value)}
className="album-select"
>

<option value="General">General</option>
<option value="Vacation">Vacation</option>
<option value="Family">Family</option>
<option value="Friends">Friends</option>
<option value="Work">Work</option>

</select>

<div {...getRootProps()} className="dropzone">

<input {...getInputProps()}/>

{isDragActive ? (
<p>Drop the images here...</p>
):(
<p>Drag & Drop images here or click to upload</p>
)}

</div>


{images.length > 0 &&(

<DndContext
collisionDetection={closestCenter}
onDragEnd={handleDragEnd}
>

<SortableContext
items={images.map(img=>img.id)}
strategy={rectSortingStrategy}
>

<div className="preview-grid">

{images.map(item=>(
<SortableItem
key={item.id}
id={item.id}
preview={item.preview}
removeImage={removeImage}
/>
))}

</div>

</SortableContext>

</DndContext>

)}


{progress > 0 &&(

<div className="progress-container">

<div
className="progress-bar"
style={{width:`${progress}%`}}
></div>

<p>{progress}% Uploaded</p>

</div>

)}


<button className="upload-btn" onClick={handleUpload}>
Upload Photos
</button>

</div>

</div>

</div>

);

}

export default Upload;