const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.patch("/:id", protect, adminOnly, updateProduct);

module.exports = router;
