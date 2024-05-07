const e = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please add a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      required: [true],
      default: "customer",
      enum: ["customer", "admin"],
    },
    photo: {
      type: String,
      required: false,
      default:
        "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg",
    },
    phone: {
      type: String,
      required: false,
      default: "+234",
    },
    address: {
      type: Object,
      required: false,
      default: {
        address: "",
        province: "",
        country: "",
      },
    },
    wishlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],
    cartItems: [

    ]
  },
  { timestamps: true }
);

// Encrypt password using bcrypt before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
