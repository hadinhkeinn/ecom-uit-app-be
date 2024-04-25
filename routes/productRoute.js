const express = require("express");
const router = express.Router();
const { createProduct } = require("../controllers/productController");

// router.post("/", protect, adminOnly, createProduct); {protect lấy từ authMiddleware.js, viết thêm adminOnly trong cùng file authMiddleware.js}

router.post("/", createProduct);

module.exports = router;
