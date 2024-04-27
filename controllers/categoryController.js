const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const { default: mongoose, get } = require("mongoose");

// Create category
const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    // Tạo sản phẩm
    const category = await Category.create({
        title,
    })
    res.status(201).json(category);
});

// Get categories
const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    res.status(200).json(category);
});

// Get all categories
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort("-createdAt");
    res.status(200).json(categories);
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    category.title = title;
    await category.save();
    res.status(200).json(category);
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category removed" })
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategories,
};
