const Photo = require("../models/Photo");
const cloudinary = require("../config/cloudinary");

exports.uploadPhoto = async (req, res) => {
  try {

    const result = await cloudinary.uploader.upload(req.body.imageUrl);

    const photo = new Photo({
      title: "Photo",
      imageUrl: result.secure_url,
      publicId: result.public_id,
      album: req.body.album
    });

    await photo.save();

    res.json(photo);

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


exports.getPhotos = async (req, res) => {

  try {

    const photos = await Photo.find();
    res.json(photos);

  } catch (error) {

    res.status(500).json(error);

  }

};


exports.deletePhoto = async (req, res) => {

  try {

    const photo = await Photo.findById(req.params.id);

    if(!photo){
      return res.status(404).json({message:"Photo not found"});
    }

    await cloudinary.uploader.destroy(photo.publicId);

    await Photo.findByIdAndDelete(req.params.id);

    res.json({message:"Photo deleted successfully"});

  } catch (error) {

    console.log(error);
    res.status(500).json(error);

  }

};