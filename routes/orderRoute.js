const router = require("express").Router();

const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/:id", protect, getOrder);
router.get("/", protect, getOrders);
// router.get("/:userId", protect, getOrderByUserId);
router.put("/:orderId", protect, adminOnly, updateOrderStatus);

module.exports = router;