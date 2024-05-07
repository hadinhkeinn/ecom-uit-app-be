const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getUsers,
  getLoginStatus,
  updateUser,
  updatePhoto,
  addToWishList,
  getWishList,
  removeFromWishList,
  saveCart,
  getCart,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.get("/getUsers", protect, adminOnly, getUsers);
router.post("/addToWishList", protect, addToWishList);
router.get("/getWishlist", protect, getWishList);
router.put("/wishlist/:productId", protect, removeFromWishList);
router.get("/getLoginStatus", getLoginStatus);
router.patch("/updateUser", protect, updateUser);
router.patch("/updatePhoto", protect, updatePhoto);
router.patch("/saveCart", protect, saveCart);
router.get("/getCart", protect, getCart);

module.exports = router;
