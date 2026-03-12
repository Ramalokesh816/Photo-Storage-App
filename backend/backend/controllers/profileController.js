const User = require("../models/User");

exports.getProfile = async (req,res)=>{

try{

const user = await User.findById(req.user.id).select("-password");

res.json(user);

}catch(err){

res.status(500).json({message:"Server error"});

}

};


exports.updateProfile = async (req,res)=>{

try{

const {name,email,phone,about,profileImage} = req.body;

const user = await User.findByIdAndUpdate(
req.user.id,
{name,email,phone,about,profileImage},
{new:true}
);

res.json(user);

}catch(err){

res.status(500).json({message:"Update failed"});

}

};