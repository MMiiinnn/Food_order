import mongoose from "mongoose";

// Cấu trúc cho Món ăn
const mealSchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: String,
  image: String,
});

// Cấu trúc cho Đơn hàng
const orderSchema = new mongoose.Schema({
  customer: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    street: String,
    "postal-code": String,
    city: String,
  },
  items: Array,
  createdAt: { type: Date, default: Date.now },
});

export const Meal = mongoose.model("Meal", mealSchema, "available-meals");
export const Order = mongoose.model("Order", orderSchema);
