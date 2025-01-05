const mongoose = require('mongoose');

const auctionschema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    startTime:{
        type: String,

    },
    endTime:{
        type: String,
    },
    category: String,
    description: String, 
    currentBid:{
        type: String,
        default: 0,
    },
    condition:{
        type:String,
        enum: ['New','Used']
    },
    image:{
        public_id:{
            type: String,
            // required: true
        },
        url:{
            type: String,
            // required: true
        }
    },
    startingBid:{
        type: Number,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bids:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            userName:String,
            profileImage:String,
            amount: Number
        },
    ],
    highestBidder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    commissionCalculated:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Auction = new mongoose.model("Auction",auctionschema);
module.exports = Auction;