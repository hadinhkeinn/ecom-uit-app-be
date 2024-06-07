const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { get } = require("mongoose");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate token
  const token = generateToken(user._id);

  if (user) {
    const { _id, name, email, role } = user;

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      // secure: true,
      // sameSite: "none",
    });

    res.status(201).json({
      _id,
      name,
      email,
      role,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Validate email and password
  if (!email || !password) {
    res.status(400).json({ message: "Vui lòng nhập đầy đủ email và mật khẩu!" });
    // throw new Error("Please fill in all fields");
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });
    // throw new Error("Invalid email or password");
  }

  // User exists, check password
  const passwordMatch = await bcrypt.compare(password, user.password);

  // Generate token
  const token = generateToken(user._id);

  if (user && passwordMatch) {
    const newUser = await User.findOne({ email }).select("-password");

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      // secure: true,
      // sameSite: "none",
    });

    // Send user data
    res.status(200).json(newUser);
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Đăng xuất thành công!" });
});

// Get users
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

// Get login status
const getLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    res.json(true);
  } else {
    res.json(false);
  }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, phone, address } = user;
    user.name = req.body.name || name;
    user.email = req.body.email || email;
    user.phone = req.body.phone || phone;
    user.address = req.body.address || address;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});

// Update user image
const updatePhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;

  const user = await User.findById(req.user._id);
  user.photo = photo;
  const updatedUser = await user.save();

  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const addToWishList = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const checkProduct = user.wishlist.includes(productId);
    if (checkProduct) { 
      res.status(200).json({ message: "Sản phẩm đã có trong mua sau" });
      return;
    }
    else
      user.wishlist.push(productId);
    await user.save();
    res.status(200).json({ message: "Thêm vào mua sau thành công" });
  } catch (error) {
    throw new Error(error);
  }
});

const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findOne({ _id }).populate("wishlist");
    res.status(200).json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const removeFromWishList = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { _id } = req.user;

  try {
    const user = await User.findByIdAndUpdate(_id, {
      $pull: { wishlist: productId },
    }, { new: true });

    await user.save();
    res.status(200).json({ message: "Sản phẩm đã được xóa khỏi danh sách!" });

  } catch (error) {
    throw new Error(error);
  }
});

const saveCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    user.cartItems = cartItems;
    await user.save();
    res.status(200).json(user.cartItems);
  } catch (error) {
    throw new Error(error);
  }
});

const getCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    res.status(200).json(user.cartItems);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getUser,
  getLoginStatus,
  updateUser,
  updatePhoto,
  addToWishList,
  getWishList,
  removeFromWishList,
  saveCart,
  getCart,
};
