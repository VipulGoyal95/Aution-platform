const  mongoose  = require("mongoose");

const paymentproofSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    proof:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    uploadedAt:{
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        enum: ['pending','approved','rejected','settled'],
        default: 'pending'
    },
    amount: String,
    comment: String
})

const Paymentproof = mongoose.model("Paymentproof",paymentproofSchema);
module.exports = Paymentproof;