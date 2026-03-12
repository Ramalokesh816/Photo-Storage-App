import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Header from "../components/Header";
import "../styles/Upload.css";

function Upload() {

const [image, setImage] = useState(null);
const [preview, setPreview] = useState(null);
const [album, setAlbum] = useState("General");

const onDrop = (acceptedFiles) => {

const file = acceptedFiles[0];

if (file) {
setImage(file);
setPreview(URL.createObjectURL(file));
}

};

const { getRootProps, getInputProps, isDragActive } = useDropzone({
onDrop,
accept: {
"image/*": []
}
});

const handleUpload = () => {

if (!image) {
alert("Please select an image");
return;
}

const reader = new FileReader();

reader.onloadend = () => {

const storedImages =
JSON.parse(localStorage.getItem("photos")) || [];

storedImages.push({
image: reader.result,
album: album
});

localStorage.setItem("photos", JSON.stringify(storedImages));

alert("Image uploaded successfully!");

setPreview(null);
setImage(null);

};

reader.readAsDataURL(image);

};

return (

<div>

<Header />

<div className="upload-page">

<div className="upload-container">

<h2>Upload Your Photo</h2>

<select
value={album}
onChange={(e) => setAlbum(e.target.value)}
className="album-select"
>

<option value="General">General</option>
<option value="Vacation">Vacation</option>
<option value="Family">Family</option>
<option value="Friends">Friends</option>
<option value="Work">Work</option>

</select>

<div {...getRootProps()} className="dropzone">

<input {...getInputProps()} />

{isDragActive ? (
<p>Drop the image here...</p>
) : (
<p>Drag & Drop image here or click to upload</p>
)}

</div>

{preview && (

<div className="preview">

<h3>Preview</h3>

<img src={preview} alt="preview" />

</div>

)}

<button className="upload-btn" onClick={handleUpload}>
Upload Photo
</button>

</div>

</div>

</div>

);

}

export default Upload;