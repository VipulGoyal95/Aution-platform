const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const Auction = require("../models/auctionSchema");
const cloudinary = require("cloudinary").v2;

const addnewAuction = asyncErrorHandler(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        const err = new Error("Image Required");
        err.statusCode = 400;
        next(err);
    }
    const { image } = req.files;

    const allowedformats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedformats.includes(image.mimetype)) {
        const err = new Error("Invalid profile image format. Only PNG, JPEG, and WebP are allowed");
        err.statusCode = 400;
        return next(err);
    }

    const { title, description, startTime, endTime, startingBid, category, condition } = req.body;
    // console.log(req.body);
    if (!title || !description || !startTime || !endTime || !startingBid || !category || !condition) {
        const err = new Error("Please provide all details");
        err.statusCode = 400;
        next(err);
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
    // if (new Date(startTime) < Date.now()) {
    //     console.log("running1");
    //     const err = new Error("Auction starting time must be greater than present time");
    //     err.statusCode = 400;
    //     next(err);
    // }
    // if (new Date(endTime) <= new Date(startTime)) {
    //     console.log("running2");
    //     const err = new Error("Auction ending time must be greater than starting time");
    //     err.statusCode = 400;
    //     next(err);
    // }

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
        next(err);
    }

})

module.exports = { addnewAuction };