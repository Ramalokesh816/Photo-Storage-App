const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({

title:String,

imageUrl:String,

publicId:String,

album:String,

mediaType:{
type:String,
enum:["image","video"],
default:"image"
},
size:Number,

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

createdAt:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("Photo",PhotoSchema);