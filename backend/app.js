import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Meal, Order } from "./models/Schemas.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Tự động xử lý Header Access-Control-Allow-Origin
app.use(express.static("public"));

// Kết nối MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI, {
    dbName: "food-db", // Ép Mongoose phải vào đúng database này
  })
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// 1. API Lấy danh sách món ăn
app.get("/api/meals", async (req, res) => {
  try {
    const meals = await Meal.find();
    console.log(meals);
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy dữ liệu món ăn." });
  }
});

// 2. API Gửi đơn hàng
app.post("/api/orders", async (req, res) => {
  const orderData = req.body.order;

  // Validate cơ bản
  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: "Dữ liệu đơn hàng trống." });
  }

  const { email, name, street, city } = orderData.customer;
  if (
    !email?.includes("@") ||
    !name?.trim() ||
    !street?.trim() ||
    !city?.trim()
  ) {
    return res
      .status(400)
      .json({ message: "Thông tin khách hàng không hợp lệ." });
  }

  try {
    const newOrder = new Order(orderData);
    await newOrder.save();
    res
      .status(201)
      .json({ message: "Đặt hàng thành công!", orderId: newOrder._id });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lưu đơn hàng." });
  }
});

// Route mặc định cho Vercel
app.get("/", (req, res) => res.send("Backend is running..."));

export default app;
