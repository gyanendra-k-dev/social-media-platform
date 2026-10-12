const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(protect, authorize("admin")); // admin only, checked on the server

// GET /api/admin/stats
router.get("/stats", async (req, res, next) => {
  try {
    const [users, products, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);
    res.json({ users, products, orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users
router.get("/users", async (req, res, next) => {
  try {
    res.json(await User.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/users/:id  (cannot delete yourself or another admin)
router.delete("/users/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Admins cannot be deleted here" });
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/orders
router.get("/orders", async (req, res, next) => {
  try {
    res.json(await Order.find().populate("user", "name email").sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/orders/:id  { status }
router.put("/orders/:id", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["placed", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
