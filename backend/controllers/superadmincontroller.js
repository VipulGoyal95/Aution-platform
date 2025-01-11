const { default: mongoose } = require("mongoose");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const Auction = require("../models/auctionSchema");
const Paymentproof = require("../models/paymentproofSchema");


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

const getAllpaymentproofs = asyncErrorHandler(async(req,res,next)=>{
    let paymentProofs = await Paymentproof.find();
    res.status(200).json({
        success: true,
        paymentProofs
    })
})

const getpaymentproofDetail = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        const err = new Error("Invalid ID Format");
        err.statusCode = 400;
        return next(err);
    }
    const paymentProof = await Paymentproof.findById(id);
    if(!paymentProof){
        const err = new Error("Payment proof not found");
        err.statusCode = 404;
        return next(err);
    }
    return res.status(200).json({
        success: true,
        paymentProof,
    })
})

const updateproofStatus = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    const {amount,status} = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
        const err = new Error("Invalid ID Format");
        err.statusCode = 400;
        return next(err);
    }
    let proof = await Paymentproof.findById(id);
    if(!proof){
        const err = new Error("Payment proof not found");
        err.statusCode = 404;
        return next(err);   
    }
    proof = await Paymentproof.findByIdAndUpdate(id,
        {status, amount},
        {new: true}
    )

    res.status(200).json({
        success:true,
        message: "Payment proof amount and status updated",
        proof
    })
})

const deletePaymentproof = asyncErrorHandler( async(req,res,next)=>{
    const {id} = req.params;
    const proof = await Paymentproof.findById(id);
    if(!proof){
        const err = new Error("Payment proof not found");
        err.statusCode = 404;
        return next(err);
    }
    await proof.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Payment proof deleted",
    })
})

module.exports = {removefromAuction,getAllpaymentproofs,getpaymentproofDetail,updateproofStatus,deletePaymentproof};