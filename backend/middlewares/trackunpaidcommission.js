const User = require("../models/userSchema");
const asyncErrorHandler = require("./asyncErrorHandler");

const trackunpaidcommission = asyncErrorHandler( async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    if(user.unpaidCommission>0){
        const err = new Error("You have unpaid commission. Please pay them before posting a new auction");
        err.statusCode = 400;
        return next(err);
    }
    next();
})

module.exports = trackunpaidcommission;