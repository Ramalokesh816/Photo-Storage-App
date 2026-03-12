const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

email:{
type:String,
required:true,
unique:true
},

password:{
type:String,
required:true
},

phone:{
type:String,

},

about:{
type:String

},

profileImage:{
type:String,
default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
},

createdAt:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("User",UserSchema);