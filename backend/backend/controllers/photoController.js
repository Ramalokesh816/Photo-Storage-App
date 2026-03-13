const Photo = require("../models/Photo");
const cloudinary = require("../config/cloudinary");


exports.uploadPhoto = async (req,res)=>{

try{

const result = await cloudinary.uploader.upload(
req.body.imageUrl,
{resource_type:"auto"}
);

const photo = new Photo({

title:"Media",

imageUrl:result.secure_url,

publicId:result.public_id,

album:req.body.album,

mediaType:result.resource_type === "video" ? "video" : "image",

size:result.bytes,   // ⭐ cloudinary file size

userId:req.user.id

});

await photo.save();

res.json(photo);

}catch(error){

console.log(error);
res.status(500).json(error);

}

};
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

const photos = await Photo.find(filter).sort({createdAt:-1});

res.json(photos);

}catch(error){

console.log("GET PHOTOS ERROR:",error);

res.status(500).json({
message:"Failed to fetch photos"
});

}

};
exports.deletePhoto = async (req,res)=>{

try{

const photo = await Photo.findById(req.params.id);

if(!photo){
return res.status(404).json({message:"Photo not found"});
}

if(photo.userId.toString() !== req.user.id){
return res.status(403).json({message:"Not authorized"});
}

await cloudinary.uploader.destroy(photo.publicId);

await Photo.findByIdAndDelete(req.params.id);

res.json({message:"Photo deleted successfully"});

}catch(error){

console.log(error);

res.status(500).json(error);

}

};