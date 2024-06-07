const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const e = require("express");
const cloudinaryUploadImg = require("../utils/cloudinary");

const createProduct = asyncHandler(async (req, res) => {
    const { name, category, quantity, description, image, regularPrice, price } = req.body;

    if (!name || !category || !quantity || !price || !description) {
        res.status(400);
        throw new Error("Vui lòng nhập đầy đủ thông tin sản phẩm.");
    }

    // Tạo sản phẩm
    const product = await Product.create({
        name,
        category,
        quantity,
        description,
        image,
        regularPrice,
        price,
    })
    res.status(201).json(product);
});

// Get products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().sort("-createdAt");
    res.status(200).json(products);
});

// Get single products
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Không tìm thấy sản phẩm.");
    }
    res.status(200).json(product);

});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Không tìm thấy sản phẩm.");
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Sản phẩm đã được xóa thành công!" })

});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
    const { name, category, brand, quantity, description, image, regularPrice, price, color } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Không tìm thấy sản phẩm.");
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
        { _id: req.params.id },
        { name, category, brand, quantity, description, image, regularPrice, price, color },
        { new: true, runValidators: true },
    );
    res.status(200).json(updatedProduct);
});

// Review product
const reviewProduct = asyncHandler(async (req, res) => {
    const { star, review, reviewDate } = req.body;
    const { id } = req.params;

    // Validation
    if (star < 1 || !review) {
        res.status(400);
        throw new Error("Vui lòng thêm đánh giá và nhận xét.");
    }

    const product = await Product.findById(id);

    if (!product) {
        res.status(400);
        throw new Error("Không tìm thấy sản phẩm");
    }

    // Update Rating
    product.ratings.push(
        {
            star,
            review,
            reviewDate,
            name: req.user.name,
            userId: req.user._id,
        }
    );
    product.save();
    res.status(200).json({ message: "Đánh giá sản phẩm thành công." });
});

// Delete review
const deleteReview = asyncHandler(async (req, res) => {
    const { userID } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(400);
        throw new Error("Không tìm thấy sản phẩm");
    }

    const newRatings = product.ratings.filter((rating) => rating.userId.toString() !== userID.toString());
    product.ratings = newRatings;
    product.save();
    res.status(200).json({ message: "Xóa đánh giá thành công." });
});

const updateReview = asyncHandler(async (req, res) => {
    const { star, review, reviewDate, userID } = req.body;
    const { id } = req.params;

    // Validation
    if (star < 1 || !review) {
        res.status(400);
        throw new Error("Vui lòng thêm đánh giá và nhận xét.");
    }

    const product = await Product.findById(id);

    if (!product) {
        res.status(400);
        throw new Error("Không tìm thấy sản phẩm");
    }

    // Match user to review
    if (req.user._id.toString() !== userID) {
        res.status(401);
        throw new Error("Không thể cập nhật đánh giá của người khác.");
    }

    // Update product review
    const updatedReview = await Product.findOneAndUpdate(
        {
            _id: product._id,
            "ratings.userId": mongoose.Types.ObjectId(userID),
        },
        {
            $set: {
                "ratings.$.star": star,
                "ratings.$.review": review,
                "ratings.$.reviewDate": reviewDate,
            }
        }
    );
    if (updatedReview) {
        res.status(200).json({ message: "Đánh giá sản phẩm được cập nhật." });
    } else {
        res.status(400).json({ message: "Đánh giá sản phẩm chưa được cập nhật." });
    }
});

// Thêm vào mua sau
const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodID } = req.body;

    try {
        const user = await User.findById(_id);
        const alreadyInWishlist = user.wishlist.find((item) => item.toString() === prodID);
        if (alreadyInWishlist) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: prodID },
                },
                { new: true },
            );
            res.status(200).json({ message: "Sản phẩm đã được xóa khỏi danh sách mua sau" });
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodID },
                },
                { new: true },
            );
            res.status(200).json({ message: "Sản phẩm đã được thêm vào danh sách mua sau" });
        }
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }

});

// Upload product images
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
        }
        const findProduct = await Product.findByIdAndUpdate(id,
            {
                image: urls.map((file) => file.url),
            },
            { new: true }
        );
        res.status(200).json(findProduct);

    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
});

module.exports = {
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
};