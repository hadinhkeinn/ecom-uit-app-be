const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategories,
} = require("../controllers/categoryController");

router.post("/", protect, adminOnly, createCategory);
router.patch("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);
router.get("/:id", getCategory);
router.get("/", getCategories);

module.exports = router;
