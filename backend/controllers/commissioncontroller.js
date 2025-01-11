const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const Paymentproof = require("../models/paymentproofSchema");
const User = require("../models/userSchema");
const cloudinary = require("cloudinary").v2;

const proofofcommission = asyncErrorHandler(async(req,res,next)=>{
    if (!req.files || Object.keys(req.files).length === 0) {
        const err = new Error("Screenshot of payment is required");
        err.statusCode = 400;
        return next(err);
    }
    const {proof} = req.files;
    const {amount,comment} = req.body;
    const user = await User.findById(req.user._id);
    if(!amount || !comment){
        const err = new Error("amount and comment must be provided");
        err.statusCode = 400;
        return next(err);
    }

    if(user.unpaidCommission ===0){
        return res.status(201).json({
            success: true,
            message: "You don't have any unpaid commission",
        })
    }

    if(user.unpaidCommission < amount){
        const err = new Error(`The amount exceeds your unpaid commission balance. Please enter an amount up to ${user.unpaidCommission}`);
        err.statusCode = 400;
        return next(err);
    }

    const allowedformats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedformats.includes(proof.mimetype)) {
        const err = new Error("Invalid screenshot format. Only PNG, JPEG, and WebP are allowed");
        err.statusCode = 400;
        return next(err);
    }

    const cloudinaryresp = await cloudinary.uploader.upload(
        proof.tempFilePath,
        {
            folder: "MERN_AUCTION_PLATFORM_PAYMENT__SS_DETAILS",
        }
    )
    if (!cloudinaryresp || cloudinaryresp.error) {
        console.error("cloudinary error", cloudinaryresp.error || "unknown cloudinary error");
        const err = new Error("Failed to upload Payment screenshot to cloudinary");
        err.statusCode = 500;
        return next(err)
    }

    const newpayment = new Paymentproof({
        userId: req.user._id,
        proof: {
            public_id: cloudinaryresp.public_id,
            url: cloudinaryresp.secure_url
        },
        amount,
        comment
    })
    await newpayment.save();
    return res.status(201).json({
        success:true,
        message:"Your proof has been submitted successfullt. We will review it and respond to you within 24 hours",
        newpayment
    })
})

module.exports = proofofcommission;