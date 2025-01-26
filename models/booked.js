const mongoose = require("mongoose");

const bookedSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true  // This will add `createdAt` and `updatedAt` automatically
});

const Booked = mongoose.model("Booked", bookedSchema);
module.exports = Booked;
