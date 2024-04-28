const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  reviewProduct,
  deleteReview,
  updateReview,
  addToWishlist,
  uploadImages,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { get } = require("mongoose");
const { productImgResize, uploadPhoto } = require("../middleware/uploadImage");

router.patch("/wishlist", protect, addToWishlist);
router.put("/upload/:id", protect, adminOnly, uploadPhoto.array('images', 5), productImgResize, uploadImages);

router.post("/", protect, adminOnly, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.patch("/:id", protect, adminOnly, updateProduct);

router.patch("/review/:id", protect, reviewProduct);
router.patch("/deleteReview/:id", protect, deleteReview);
router.patch("/updateReview/:id", protect, updateReview);

module.exports = router;
