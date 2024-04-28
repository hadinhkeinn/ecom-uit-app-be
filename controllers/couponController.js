const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const { default: mongoose, get } = require("mongoose");
// Create a new coupon
const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.status(201).json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});
// Get all coupons
const getCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        throw new Error(error);
    }
});
// Update a coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.status(200).json(deletedCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
};

