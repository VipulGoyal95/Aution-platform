import mongoose from "mongoose";
import asyncErrorHandler from "../middlewares/asyncErrorHandler.js";
import Auction from "../models/auctionSchema.js";
import Paymentproof from "../models/paymentproofSchema.js";
import User from "../models/userSchema.js";
import Commission from "../models/commissionSchema.js";

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

    return res.status(200).json({
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

const fetchAllusers =asyncErrorHandler(async(req,res,next)=>{
    const users = await User.aggregate([
        {
            $group:{
                _id:{
                    month:{$month:"$createdAt"},
                    year:{$year:"$createdAt"},
                    role:"$role"
                },
                count: {$sum:1}
            }
        },
        {
            $project:{
                month:"$_id.month",
                year:"$_id.year",
                role:"$_id.role",
                count:1,
                _id: 0
            }
        },
        {
            $sort:{year:1,month:1}
        }
    ]);
    const biddersarray = users.filter(user=> user.role==="bidders")
    const auctioneersarray = users.filter(user=>user.role==="Auctioneer");

    const transformdayintomonth = (data,totalmonth=12)=>{
        const result = Array(totalmonth).fill(0);

        data.map(item=>{
            result[item.month-1]=item.count
        })
        return result;
    }

    const biddersCount = transformdayintomonth(biddersarray);
    const auctioneersCount = transformdayintomonth(auctioneersarray);

    return res.status(200).json({
        success: true,
        biddersCount,
        auctioneersCount
    })
 
})

const monthlyRevenue = asyncErrorHandler(async(req,res,next)=>{
    const payments = await Commission.aggregate([
        {
            $group:{
                _id:{
                    month:{$month:"$createdAt"},
                    year:{$year:"$createdAt"}
                },
                totalRevenue: {$sum:"$amount"}
            },
            
        },
        {
            $sort:{
                month:1,
                year:1
            }
        }
    ]);

    const transformdayintomonthrevenue = (payments,totalmonth=12)=>{
        const result = Array(totalmonth).fill(0);

        payments.map(item=>{
            result[item._id.month-1]=item.totalRevenue
        })
        return result;
    }

    const revenue = transformdayintomonthrevenue(payments);
    return res.status(200).json({
        success: true,
        revenue
    })
})

export { removefromAuction, getAllpaymentproofs, getpaymentproofDetail, updateproofStatus, deletePaymentproof, fetchAllusers };