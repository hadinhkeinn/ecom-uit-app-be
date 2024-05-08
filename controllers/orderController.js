const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");

const createOrder = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  // validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);
    const userCart = await Cart.findOne({ userId: user._id }).populate(
      "products.cartItem",
      "_id name price image"
    );
    let finalAmount = 0;
    let cartTotal = 0;
    const products = userCart.products;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].cartItem.price * products[i].quantity;
    }

    if (coupon) {
      const validCoupon = await Coupon.findOne({ name: coupon });
      if (validCoupon === null) {
        throw new Error("Invalid Coupon");
      }
      finalAmount = (
        cartTotal -
        (cartTotal * validCoupon.discount) / 100
      ).toFixed(2);
    } else {
      finalAmount = cartTotal;
    }

    await new Order({
      products: [...userCart.products],
      paymentIntent: {
        // id: uniqid(),
        // method: "COD",
        amount: finalAmount,
        status: "Processing",
        created: Date.now(),
        currency: "VND",
      },
      orderBy: user._id,
      orderStatus: "Processing",
    }).save();

    // let update = userCart.products.map((item) => {
    //   return {
    //     updateOne: {
    //       filter: { _id: item.cartItem },
    //       update: { $inc: { quantity: -item.count, sold: +item.count } },
    //     },
    //   };
    // });
    // await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  // validateMongoDbId(_id);
  try {
    const userOrders = await Order.findOne({ orderBy: _id })
      .populate("products.product")
      .populate("orderBy")
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const allUserOrders = await Order.find()
      .populate("products.product")
      .populate("orderBy")
      .exec();
    res.json(allUserOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // validateMongoDbId(id);
  try {
    const userOrders = await Order.findOne({ orderBy: userId })
      .populate("products.product")
      .populate("orderBy")
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  // validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createOrder,
  getOrders,
  getAllOrders,
  getOrderByUserId,
  updateOrderStatus,
};
