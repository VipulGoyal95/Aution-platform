const  User  = require("../models/userSchema");
const jwt = require('jsonwebtoken');
const  bcrypt =require('bcrypt');
const cloudinary = require('cloudinary').v2;
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');

const generatetoken = (id)=>{
    const token = jwt.sign({id: id}, process.env.JWT_SECRET, {expiresIn: "1h"});
    return token;
}
const comparepassword = async(enteredPassword,password)=>{
    return await bcrypt.compare(enteredPassword, password);
}
const register = asyncErrorHandler( async(req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        const err = new Error("Profile Image Required");
        err.statusCode = 400;
        return next(err);
    }

    const { profileImage } = req.files;
    const { Username, email, password, address, phone, role } = req.body;

    if (!Username || !email || !password || !address || !phone || !role) {
        const err = new Error("Please fill the full form");
        err.statusCode = 400;
        return next(err);  
    }
    const existinguser = await User.findOne({email});
    if(existinguser){
        const err = new Error("User already exists");
        err.statusCode = 400;
        return next(err); 
    }

    const cloudinaryresp = await cloudinary.uploader.upload(
        profileImage.tempFilePath,
        {
            folder: "MERN_AUCTION_USERS_PROFILE_IMAGES",
        }
    )
    if(!cloudinaryresp || cloudinaryresp.error){
        console.error("cloudinary error",cloudinaryresp.error||"unknown cloudinary error");
        const err = new Error("Failed to upload profile image to cloudinary");
        err.statusCode = 500;
        return next(err)
    }
    const hashedpassword = await bcrypt.hash(password,10);
    const newUser = new User({
        Username,
        email,
        password: hashedpassword,
        address,
        phone,
        role,
        profileImage:{
            public_id: cloudinaryresp.public_id,
            url: cloudinaryresp.secure_url,
        }
    } )

    await newUser.save();
    console.log(newUser);
    const token = generatetoken(newUser._id);
    res.cookie("token", token, { expiresIn: "1h" });
    res.status(200).json({
        message: "User Registered",
        success: true, 
    });
});

module.exports = register;