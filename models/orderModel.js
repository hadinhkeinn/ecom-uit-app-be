const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderDate: {
      type: Date,
      required: true,
    },
    orderTime: {
      type: String,
      required: true,
    },
    orderAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "Đang chờ",
      enum: [
        "Đang chờ",
        "Đã xác nhận",
        "Đang vận chuyển",
        "Đã giao hàng",
        "Hoàn thành",
        "Đã hủy",
      ],
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    cartItems: [],
    shippingAddress: {
      type: Object,
    },
    coupon: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
