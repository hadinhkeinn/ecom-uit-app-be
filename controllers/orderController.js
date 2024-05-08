const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {
    orderDate,
    orderTime,
    orderAmount,
    orderStatus,
    paymentMethod,
    cartItems,
    shippingAddress,
    coupon,
  } = req.body;

  try {
    const order = await Order.create({
      user: _id,
      orderDate,
      orderTime,
      orderAmount,
      orderStatus,
      paymentMethod,
      cartItems,
      shippingAddress,
      coupon,
    });
    res.status(201).json({ order: order, message: "Đặt hàng thành công!" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await User.findOne({ _id });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.role === 'admin') {
      const orders = await Order.find()
        .sort("-createdAt")
        .exec();
      res.status(200).json(orders);
    } else {
      const orders = await Order.find({ user: _id })
        .sort("-createdAt")
        .exec();
      res.status(200).json(orders);
    }

  } catch (error) {
    throw new Error(error);
  }
});

const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // validateMongoDbId(id);
  try {
    const order = await Order.findById(id)
    res.status(200).json(order);
  } catch (error) {
    throw new Error(error);
  }
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const { id } = req.params;
  // validateMongoDbId(id);
  try {
    const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });

    await order.save();
    res.status(200).json({ data: order, message: "Cập nhật trạng thái đơn hàng thành công!" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
};
