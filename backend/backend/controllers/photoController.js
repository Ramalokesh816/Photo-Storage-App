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

/* Upload file buffer to Cloudinary */

const streamUpload = () => {

return new Promise((resolve,reject)=>{

const stream = cloudinary.uploader.upload_stream(
{
resource_type:"video",

// force mobile friendly codec
video_codec:"h264",

// compress automatically
quality:"auto:eco",

// limit bitrate
bit_rate:"800k",

// generate progressive stream
flags:"progressive"
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

/* Save media details in MongoDB */

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

/* Delete from Cloudinary */

await cloudinary.uploader.destroy(photo.publicId,{
resource_type: photo.mediaType === "video" ? "video" : "image"
});

/* Delete from MongoDB */

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