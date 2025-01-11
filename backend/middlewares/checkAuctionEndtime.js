const mongoose  = require("mongoose");
const asyncErrorHandler = require("./asyncErrorHandler");
const Auction = require("../models/auctionSchema");

const checkAuctionEndtime = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid ID format");
        err.statusCode = 400;
        return next(err);
    }
    const auctionItem = await Auction.findById(id);
    if (!auctionItem) {
        const err = new Error("Auction not found");
        err.statusCode = 404;
        return next(err);
    }
    
    if (new Date(auctionItem.startTime)>Date.now()){
        const err = new Error("Auction is not started yet");
        err.statusCode = 400;
        return next(err);
    }
    if (new Date(auctionItem.endTime) < Date.now()) {
        const err = new Error("Auction has ended");
        err.statusCode = 400;
        return next(err);
    }
    next();
})

module.exports = checkAuctionEndtime;