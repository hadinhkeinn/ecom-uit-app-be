const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
} = require("../controllers/couponController");


router.post("/createCoupon", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getCoupons);
router.get("/:name", protect, getCoupon);
router.patch("/:id", protect, adminOnly, updateCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

module.exports = router;