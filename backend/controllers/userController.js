const User = require("../models/userSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');

const generatetoken = (id,res) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000),httpOnly: true});
    return token;
}
const comparepassword = async (enteredPassword, password) => {
    return await bcrypt.compare(enteredPassword, password);
}
const register = asyncErrorHandler(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        const err = new Error("Profile Image Required");
        err.statusCode = 400;
        return next(err);
    }
    
    const { profileImage } = req.files;
    const allowedformats = ["image/png","image/jpeg","image/webp"];
    if (!allowedformats.includes(profileImage.mimetype)) {
        const err = new Error("Invalid profile image format. Only PNG, JPEG, and WebP are allowed");
        err.statusCode = 400;
        return next(err);
    }
    const { userName, email, password, address, phone, role } = req.body;

    if (!userName || !email || !password || !address || !phone || !role) {
        const err = new Error("Please fill the full form");
        err.statusCode = 400;
        return next(err);
    }
    const existinguser = await User.findOne({ email });
    if (existinguser) {
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
    if (!cloudinaryresp || cloudinaryresp.error) {
        console.error("cloudinary error", cloudinaryresp.error || "unknown cloudinary error");
        const err = new Error("Failed to upload profile image to cloudinary");
        err.statusCode = 500;
        return next(err)
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        userName,
        email,
        password: hashedpassword,
        address,
        phone,
        role,
        profileImage: {
            public_id: cloudinaryresp.public_id,
            url: cloudinaryresp.secure_url,
        }
    })

    await newUser.save();
    console.log(newUser);
    const token = generatetoken(newUser._id,res);
    res.status(200).json({
        message: "User Registered",
        token,
        success: true,
    });
});

const login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if(!email||!password){
        const err = new Error("Please fill the full form");
        err.statusCode = 400;
        return next(err);
    }
    const user = await User.findOne({email});
    if(!user){
        const err = new Error("User Don't exist");
        err.statusCode = 400;
        return next(err);
    }
    const verifypassword = await comparepassword(password,user.password);
    if(!verifypassword){
        const err = new Error("Invalid Password");
        err.statusCode = 400;
        return next(err);
    }
    res.status(200).json({
        message: "Login Successful",
        token: generatetoken(user._id,res),
        success: true,
        user: user
    })
})

const getUserprofile = (req,res)=>{
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
        message:"User profile"
    })
}

const logout = asyncErrorHandler( async(req,res,next)=>{
    res.clearCookie("token");
    res.status(200).json({
        message: "Logout Successful",
        success: true,
    })
})

module.exports = {register,login,logout,getUserprofile};