import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Upload.css";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
SortableContext,
useSortable,
arrayMove,
verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function Upload(){

const [files,setFiles] = useState([]);
const [album,setAlbum] = useState("General");
const [loading,setLoading] = useState(false);
const [progress,setProgress] = useState(0);

/* LOAD SAVED FILES */

useEffect(()=>{

const saved = localStorage.getItem("uploadFiles");

if(saved){
setFiles(JSON.parse(saved));
}

},[]);

/* SAVE FILES */

useEffect(()=>{
localStorage.setItem("uploadFiles",JSON.stringify(files));
},[files]);

/* DROPZONE */

const onDrop = (acceptedFiles)=>{

acceptedFiles.forEach(file=>{

const reader = new FileReader();

reader.onloadend = ()=>{

const newFile = {
id:Math.random().toString(),
fileType:file.type,
preview:reader.result
};

setFiles(prev=>[...prev,newFile]);

};

reader.readAsDataURL(file);

});

};

const {getRootProps,getInputProps} = useDropzone({
accept:{
"image/*":[],
"video/*":[]
},
onDrop
});

/* REMOVE FILE */

const removeFile = (id)=>{

setFiles(prev=>prev.filter(file=>file.id !== id));

};

/* DRAG REORDER */

const handleDragEnd = (event)=>{

const {active,over} = event;

if(!over) return;

if(active.id !== over.id){

const oldIndex = files.findIndex(f=>f.id === active.id);
const newIndex = files.findIndex(f=>f.id === over.id);

setFiles(arrayMove(files,oldIndex,newIndex));

}

};

/* UPLOAD */

const uploadAll = async ()=>{

if(files.length===0){
alert("Select files first");
return;
}

setLoading(true);
setProgress(0);

try{

const token = localStorage.getItem("token");

for(let i=0;i<files.length;i++){

await fetch("https://photo-storage-app.onrender.com/api/upload",{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
imageUrl:files[i].preview,
album
})
});

const percent = Math.round(((i+1)/files.length)*100);
setProgress(percent);

}

toast.success("Photo uploaded successfully 📷");

setFiles([]);
localStorage.removeItem("uploadFiles");

}catch(error){

console.log(error);
alert("Upload failed");

}

setLoading(false);

};

/* SORTABLE ITEM */

function SortableItem({file}){

const {
attributes,
listeners,
setNodeRef,
transform,
transition
} = useSortable({id:file.id});

const style={
transform:CSS.Transform.toString(transform),
transition
};

return(

<div
ref={setNodeRef}
style={style}
className="preview-card"
>

<div {...attributes} {...listeners}>

{file.fileType.startsWith("image") ? (

<img src={file.preview} alt="preview"/>

) : (

<video controls>
<source src={file.preview}/>
</video>

)}

</div>

<button
className="remove-btn"
onPointerDown={(e)=>e.stopPropagation()}
onClick={()=>removeFile(file.id)}
>
Remove
</button>

</div>

);

}

return(

<div>

<Header/>

<div className="upload-container">

<h2>Upload Media</h2>

<div {...getRootProps()} className="dropzone">

<input {...getInputProps()} />

<p>Drag & Drop media or click to select</p>

</div>

<DndContext
collisionDetection={closestCenter}
onDragEnd={handleDragEnd}
>

<SortableContext
items={files.map(f=>f.id)}
strategy={verticalListSortingStrategy}
>

<div className="preview-grid">

{files.map(file=>(
<SortableItem key={file.id} file={file}/>
))}

</div>

</SortableContext>

</DndContext>

{loading && (

<div className="progress-wrapper">

<div
className="progress-bar"
style={{width:`${progress}%`}}
></div>

<p>{progress}% Uploaded</p>

</div>

)}

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

<button
className="upload-btn"
onClick={uploadAll}
disabled={loading}
>

{loading ? "Uploading..." : "Upload All"}

</button>

</div>

<Footer/>

</div>

);

}

export default Upload;