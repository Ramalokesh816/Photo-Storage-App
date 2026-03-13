const Photo = require("../models/Photo");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/* ======================
   UPLOAD PHOTO / VIDEO
====================== */

exports.uploadPhoto = async (req,res)=>{

try{

if(!req.file){
return res.status(400).json({message:"No file uploaded"});
}

const album = req.body.album;

/* Upload buffer to Cloudinary */

const streamUpload = () => {

return new Promise((resolve,reject)=>{

const stream = cloudinary.uploader.upload_stream(
{
resource_type: "video",

// mobile compatible
format: "mp4",

// progressive streaming
quality: "auto",
video_codec: "auto",

// reduce buffering
eager: [
{ width: 1280, crop: "limit", quality: "auto", format: "mp4" }
],

eager_async: true
},
(error,result)=>{

if(result){
resolve(result);
}else{
reject(error);
}

}
);

streamifier
.createReadStream(req.file.buffer)
.pipe(stream);

});

};

const result = await streamUpload();

/* Save media to MongoDB */

const photo = new Photo({

title:"Media",

imageUrl: result.secure_url,

publicId: result.public_id,

album: album,

mediaType: result.resource_type === "video" ? "video" : "image",

size: result.bytes,

userId: req.user.id

});

await photo.save();

res.json(photo);

}catch(error){

console.log("UPLOAD ERROR:",error);

res.status(500).json({
message:"Upload failed"
});

}

};

/* ======================
   GET PHOTOS
====================== */

exports.getPhotos = async (req,res)=>{

try{

if(!req.user){
return res.status(401).json({message:"Unauthorized"});
}

const filter = {
userId:req.user.id
};

if(req.query.album){
filter.album = req.query.album;
}

const photos = await Photo
.find(filter)
.sort({createdAt:-1});

res.json(photos);

}catch(error){

console.log("GET PHOTOS ERROR:",error);

res.status(500).json({
message:"Failed to fetch photos"
});

}

};

/* ======================
   DELETE PHOTO
====================== */

exports.deletePhoto = async (req,res)=>{

try{

const photo = await Photo.findById(req.params.id);

if(!photo){
return res.status(404).json({
message:"Photo not found"
});
}

if(photo.userId.toString() !== req.user.id){
return res.status(403).json({
message:"Not authorized"
});
}

await cloudinary.uploader.destroy(photo.publicId,{
resource_type:"video"
});

await Photo.findByIdAndDelete(req.params.id);

res.json({
message:"Photo deleted successfully"
});

}catch(error){

console.log("DELETE ERROR:",error);

res.status(500).json({
message:"Delete failed"
});

}

};