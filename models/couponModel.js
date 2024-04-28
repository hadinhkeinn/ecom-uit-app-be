const e = require("express");
const mongoose = require("mongoose");


const couponSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        uppercase: true,
        trim: true,
    },
    discount: {
        type: Number,
        required: [true, "Please add a discount"],
        trim: true,
    },
    expiry: {
        type: Date,
        required: [true, "Please add an expiry date"],
        trim: true,
    },
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
