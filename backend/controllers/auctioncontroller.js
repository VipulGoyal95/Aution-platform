const { default: mongoose } = require("mongoose");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const Auction = require("../models/auctionSchema");
const User = require("../models/userSchema");
const cloudinary = require("cloudinary").v2;

const addnewAuction = asyncErrorHandler(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        const err = new Error("Image Required");
        err.statusCode = 400;
        return next(err);
    }
    const { image } = req.files;

    const allowedformats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedformats.includes(image.mimetype)) {
        const err = new Error("Invalid profile image format. Only PNG, JPEG, and WebP are allowed");
        err.statusCode = 400;
        return next(err);
    }

    const { title, description, startTime, endTime, startingBid, category, condition } = req.body;
    if (!title || !description || !startTime || !endTime || !startingBid || !category || !condition) {
        const err = new Error("Please provide all details");
        err.statusCode = 400;
        return next(err);
    }
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validate if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        const err = new Error("Invalid date format provided for startTime or endTime");
        err.statusCode = 400;
        return next(err);
    }
    if(start<Date.now()) {
        const err = new Error("Auction starting time must be greater than present time");
        err.statusCode = 400;
        return next(err);
    }

    if (end <= start) {
        const err = new Error("Auction ending time must be greater than starting time");
        err.statusCode = 400;
        return next(err);
    }

    try {
        const cloudinaryresp = await cloudinary.uploader.upload(
            image.tempFilePath,
            {
                folder: "MERN_AUCTION_PLATFORM_AUCTION_DETAILS",
            }
        )
        if (!cloudinaryresp || cloudinaryresp.error) {
            console.error("cloudinary error", cloudinaryresp.error || "unknown cloudinary error");
            const err = new Error("Failed to upload Auction image to cloudinary");
            err.statusCode = 500;
            return next(err)
        }
        
        const alreadyoneauctioncreated = await Auction.find({
            createdBy: req.user._id,
            endTime: { $gt: Date.now() },
        })
        if (alreadyoneauctioncreated[0]) {
            const err = new Error("You already have one auction or you have unpaid commission");
            err.statusCode = 500;
            return next(err);
        }
        const newAuction = new Auction({
            title,
            description,
            startTime,
            endTime,
            startingBid,
            image: {
                public_id: cloudinaryresp.public_id,
                url: cloudinaryresp.secure_url
            },
            category,
            condition,
            createdBy: req.user._id,
        })

        await newAuction.save();
        return res.status(201).json({
            success: true,
            message: `Auction item created and will be listed on auction page at ${startTime}`,
            newAuction
        })
    } catch (error) {
        const err = new Error(error.message || "failed to create auction");
        err.statusCode = 500;
        return next(err);
    }

})

const getAllItem = asyncErrorHandler(async(req,res,next)=>{
    let items = await Auction.find();
    return res.status(200).json({
        success: true,
        items,
    })
})

const getMyAuctionItems = asyncErrorHandler(async(req,res,next)=>{
    const items = await Auction.find({createdBy: req.user._id});
    return res.status(200).json({
        success: true,
        items,
    })
})

const getAuctionDetails = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        const err = new Error("Invalid ID Format");
        err.statusCode = 400;
        return next(err);
    }

    const auctionItem = await Auction.findById(id);
    if(!auctionItem){
        const err = new Error("Auction not found");
        err.statusCode = 404;
        return next(err);
    }
    const bidders = auctionItem.bids.sort((a,b)=> b.bid-a.bid);
    return res.status(200).json({
        success: true,
        auctionItem,
        bidders,
    })
})

const removefromAuction = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        const err = new Error("Invalid ID Format");
        err.statusCode = 400;
        return next(err);
    }
    const AuctionItem = await Auction.findById(id);
    if(!AuctionItem){
        const err = new Error("Auction not found");
        err.statusCode = 404;
        return next(err);
    }
    await AuctionItem.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Auction item removed successfully",
    })
})

const republishItem = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        const err = new Error("Invalid ID format");
        err.statusCode=400;
        return next(err);
    }
    let auctionItem = await Auction.findById(id);
    if(!auctionItem){
        const err = new Error("Auction not found");
        err.statusCode=404;
        return next(err);
    }
    if(new Date(auctionItem.startTime)> Date.now()){
        const err = new Error("Current Auction is already active");
        err.statusCode=400;
        return next(err);
    }
    const data = {
        startTime: req.body.startTime,
        endTime: req.body.endTime
    }
    if(new Date(data.startTime)<Date.now()){
        const err = new Error("Auction starting time must be greater than present time");
        err.statusCode=400;
        return next(err);
    }
    if(new Date(data.startTime)>=new Date(data.endTime)){
        const err = new Error("Auction ending time must be greater than starting time");
        err.statusCode=400;
        return next(err);
    }
    data.bids=[]
    data.commissionCalculated=false
    auctionItem = await Auction.findByIdAndUpdate(id,data,{new: true});
    const user = await User.findByIdAndUpdate(req.user._id,{unpaidCommission:0},{new:true});
    return res.status(200).json({
        success: true,
        message: `Auction item republished and will be active from ${data.startTime}`,
        auctionItem,
        user
    })
})

module.exports = { addnewAuction,getAllItem,getMyAuctionItems,getAuctionDetails,removefromAuction,republishItem};