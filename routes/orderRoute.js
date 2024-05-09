const router = require("express").Router();

const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    createPaymentUrl
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/:id", protect, getOrder);
router.get("/", protect, getOrders);
// router.get("/:userId", protect, getOrderByUserId);
router.patch("/:id", protect, adminOnly, updateOrderStatus);
router.post("/create_payment_url", protect, createPaymentUrl);

module.exports = router;