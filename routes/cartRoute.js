const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

router.get("/", protect, cartController.getCart);
router.post("/", protect, cartController.addToCart);
router.post("/decrease", protect, cartController.decrementCartItem);
router.post("/increase", protect, cartController.increaseCartItem);
router.delete("/:cartItemId", protect, cartController.deleteCartItem);

module.exports = router;
