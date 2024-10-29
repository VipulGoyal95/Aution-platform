const  User  = require("../models/userSchema");
const cloudinary = require('cloudinary').v2;

const register = async(req, res, next) => {
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
    const newUser = new User({
        Username,
        email,
        password,
        address,
        phone,
        role,
        profileImage:{
            public_id: cloudinaryresp.public_id,
            url: cloudinaryresp.secure_url,
        }
    } )

    await newUser.save();
    res.status(200).json({
        message: "User Registered",
        success: true,
    });
};

module.exports = register;


Select r.student_id as Student ID, s.first_name as First Name
from registration as r,Student as s 
where r.student_id == s.student_id and r.fullterm_grade == 'A' and (r.reg_year == 2012 or r.reg_year == 2013)