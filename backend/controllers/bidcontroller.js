import asyncErrorHandler from "../middlewares/asyncErrorHandler.js";
import Auction from "../models/auctionSchema.js";
import Bid from "../models/bidSchema.js";
import User from "../models/userSchema.js";

const placebid = asyncErrorHandler( async(req,res,next)=>{
    const {id} = req.params;
    const auctionItem = await Auction.findById(id);
    if(!auctionItem){
        const err = new Error("Auction not found");
        err.statusCode = 404;
        return next(err);
    }
    const {amount} = req.body;
    if(!amount){
        const err = new Error("Please place your bid");
        err.statusCode = 400;
        return next(err);
    }
    if(amount<=auctionItem.currentBid){
        const err = new Error("Bid amount should be greater than current bid");
        err.statusCode = 400;
        return next(err);
    }
    if(amount<auctionItem.startingBid){
        const err = new Error("Bid amount should be greater than starting bid");
        err.statusCode = 400;
        return next(err);
    }

    try {
        const existingbid = await Bid.findOne({
            "bidder.id": req.user._id,
            auctionItem: auctionItem._id
        })
        const existingBidInAuction = auctionItem.bids.find(bids=> bids.userId.toString()==req.user._id.toString());
        if(existingbid && existingBidInAuction){
            existingbid.amount=amount;
            existingBidInAuction.amount=amount
            await existingbid.save();
            await existingBidInAuction.save();
            auctionItem.currentBid=amount
        }
        else{
            const bidderDetail = await User.findById(req.user._id)
            const newbid = new Bid({
                amount,
                bidder:{
                    id: req.user._id,
                    userName: bidderDetail.Username,
                    profileImage: bidderDetail.profileImage?.url
                },
                auctionItem: auctionItem._id
            })
            await newbid.save();
            auctionItem.bids.push({
                userId: req.user._id,
                userName: bidderDetail.Username,
                profileImage: bidderDetail.profileImage?.url,
                amount
            })
        }
        await auctionItem.save();

        return res.status(201).json({
            success: true,
            message: "Bid Placed",
            currentBid: auctionItem.currentBid
        });
    } catch (error) {
        const err = new Error(error.message || "Failed to place bid");
        err.statusCode = 500;
        return next(err);
    }
})

export default placebid;