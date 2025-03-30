import validator from "validator";
import bcrypt from "bcrypt"; // Fixed typo
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'


// API for adding a doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imagefile = req.file; // Ensure multer is used

    // Checking for all required fields
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: "Missing details" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    // Hash doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Debugging: Log the received file and request URL
    console.log("Received file:", req.file);
    console.log("Request URL:", req.originalUrl);

    // Upload image to Cloudinary (Ensure multer is configured)
    let imageUrl = "";
    if (imagefile) {
      const imageUpload = await cloudinary.uploader.upload(imagefile.path, { resource_type: "image" });
      imageUrl = imageUpload.secure_url;
    }

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(), // Fixed property name
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api for admin login

const loginAdmin=async(req,res)=>{
    try{

        const {email,password}=req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
               const token=jwt.sign(email+password,process.env.JWT_SECRET)
               res.json({success:true,token})
            else{
                res.json({success:false,message:"Invalid Credentials"})
            }
        }
    }
    catch(error){
        console.log(error)
        res.json({ success: false, message: error.message });

    }
}
export { addDoctor,loginAdmin };
