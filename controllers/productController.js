const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, brand, quantity, description, image, regularPrice, price, color } = req.body;

    if (!name || !category || !brand || !quantity || !price || !description) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    // Tạo sản phẩm
    const product = await Product.create({
        name, 
        sku, 
        category, 
        brand, 
        quantity, 
        description, 
        image, 
        regularPrice, 
        price, 
        color,
    })
    res.status(201).json(product);
});

module.exports = {
    createProduct,
};