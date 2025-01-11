const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    amount: String,
    bidder:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName: String,
        profileImage: String
    },
    auctionItem:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuctionItem',
        required: true
    }
})

const Bid = new mongoose.model("Bid",bidSchema);
module.exports = Bid;