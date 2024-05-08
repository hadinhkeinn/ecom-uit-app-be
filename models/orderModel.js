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
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Order Placed",
        "On Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
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
    }
  },
{
  timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;