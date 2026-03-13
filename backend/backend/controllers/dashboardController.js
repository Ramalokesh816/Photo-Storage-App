const Photo = require("../models/Photo");

exports.getDashboard = async (req, res) => {

try {

const photos = await Photo.find();

/* TOTAL PHOTOS */

const totalPhotos = photos.filter(
p => p.mediaType === "image"
).length;

/* TOTAL VIDEOS */

const totalVideos = photos.filter(
p => p.mediaType === "video"
).length;

/* ALBUMS */

const albums = new Set(
photos.map(p => p.album)
).size;

/* STORAGE CALCULATION */

let storageBytes = 0;

photos.forEach(p => {
if(p.size){
storageBytes += p.size;
}
});

const storageUsed = (storageBytes / (1024 * 1024)).toFixed(2);

/* RECENT UPLOADS */

const recentUploads = photos
.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
.slice(0,8);
const monthlyUploads = [];

for(let i=0;i<12;i++){

monthlyUploads.push({
month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
uploads:0
});

}

photos.forEach(photo=>{
const month = new Date(photo.createdAt).getMonth();
monthlyUploads[month].uploads +=1;
});

res.json({
totalPhotos,
totalVideos,
albums,
storageUsed,
recentUploads,
monthlyUploads
});

} catch (error) {

console.log(error);
res.status(500).json({message:"Dashboard error"});

}

};