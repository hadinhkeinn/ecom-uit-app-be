const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");
const moment = require("moment");
const qs = require("qs");
const crypto = require("crypto");

/// Sort object by key
function sortObject(obj) {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
      /%20/g,
      '+',
    );
  }
  return sorted;
}

// Create payment url
const createPaymentUrl = asyncHandler(async (req, res) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  const userId = req.user._id;
  let discountId = req.body.discountId;
  if (!discountId) {
    discountId = '';
  }

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket
      ? req.connection.socket.remoteAddress
      : null);

  const tmnCode = "6YVIZ9MZ";
  const secretKey = "9NIFJSGWEUNK84TO8XNWZCRJF0LAECAC";
  let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl = "http://localhost:3000/checkout-success";
  const orderId = moment(date).format('DDHHmmss');
  const bankCode = req.body.bankCode || '';
  const locale = 'vn';
  const currCode = 'VND';
  const amount = req.body.amount;
  let vnp_Params = {};
  // vnp_Params['vnp_UserId'] = userId;
  // vnp_Params['vnp_DiscountId'] = discountId;
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] =
    'ThanhtoanchomaGD:' + orderId + ' ' + userId + ' ' + discountId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

  res.json(vnpUrl);
});

// Create order
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
  createPaymentUrl,
};
