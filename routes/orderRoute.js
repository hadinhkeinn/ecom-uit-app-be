const router = require("express").Router();

const orderController = require("../controllers/orderController");

router.post("/create", orderController.createOrder);
router.get("/orders", orderController.getOrders);
router.get("/allOrders", orderController.getAllOrders);
router.get("/:userId", orderController.getOrderByUserId);
router.put("/:orderId", orderController.updateOrderStatus);

module.exports = router;