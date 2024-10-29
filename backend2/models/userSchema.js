const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address: String,
    phone:{
        type:String,
        minLength: [11,'Phone Number must contain exact 11 digits'],
        maxLength: [11,'Phone Number must contain exact 11 digits']
    },
    profileImage:{
        public_id:{
            type:String,
            // required:true
        },
        url:{
            type:String,
            // required:true
        }
    },
    paymentMethods:{
        bankTransfer:{
            bankAccountNumber: String,
            bankAccountName: String,
            bankName: String
        }
    },
    role:{
        type: String,
        enum: ["Auctioneer","Bidder","Super Admin"],
    },
    unpaidCommission:{
        type: Number,
        default: 0,
    },
    auctionsWon:{
        type: Number,
        default: 0
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model("User",userSchema);

module.exports = User;