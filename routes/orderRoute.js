const router = require("express").Router();

const {
    createOrder,
    getOrders,
    getOrderByUserId,
    updateOrderStatus,
    getAllOrders,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/create", protect, createOrder);
router.get("/orders", protect, getOrders);
router.get("/allOrders", protect, adminOnly, getAllOrders);
router.get("/:userId", protect, getOrderByUserId);
router.put("/:orderId", protect, adminOnly, updateOrderStatus);

module.exports = router;