const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = require("../controllers/productController");

// router.post("/", protect, adminOnly, createProduct); {protect lấy từ authMiddleware.js, viết thêm adminOnly trong cùng file authMiddleware.js}
router.post("/", createProduct);

router.get("/", getProducts);

router.get("/:id", getProduct);

// router.delete("/:id", protect, adminOnly, createProduct); {protect lấy từ authMiddleware.js, viết thêm adminOnly trong cùng file authMiddleware.js}
router.delete("/:id", deleteProduct);

// router.patch("/:id", protect, adminOnly, createProduct); {protect lấy từ authMiddleware.js, viết thêm adminOnly trong cùng file authMiddleware.js}
router.patch("/:id", updateProduct);


module.exports = router;
