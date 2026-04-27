import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();

//Configuration
cloudinary.config({
  cloud_name: "dkmn1reds",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (fileLink) => {
  // Upload Image
  const uploadResult = await cloudinary.uploader.upload(fileLink, {
    resource_type: "auto",
  })
  .catch((error) => {
    console.log(error)
    //if failes remove file from server
    fs.unlinksync(fileLink)
  })
  return uploadResult
};

export default uploadToCloudinary