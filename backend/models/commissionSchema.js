const { default: mongoose, Mongoose } = require("mongoose");

const commissionschema = new mongoose.Schema({
    amount:Number,
    user: mongoose.Schema.Types.ObjectId,
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

const Commission = new mongoose.model("Commission", commissionschema);

module.exports = Commission;