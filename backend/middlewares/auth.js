const asyncErrorHandler = require("./asyncErrorHandler");
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');

const isAuth = asyncErrorHandler(async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        const err = new Error("User is not authenticated");
        err.statusCode=400;
        return next(err);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});
const isAuthorised = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            const err = new Error("User is not authorized to perform this action");
            err.statusCode=403;
            return next(err);
        }
        next();
    }
}

module.exports =  {isAuth,isAuthorised};