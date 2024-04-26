const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);

const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
