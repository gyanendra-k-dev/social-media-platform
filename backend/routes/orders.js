const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

// POST /api/orders  -> turn the cart into an order (price is read from the database, not the browser)
router.post("/", async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    const lines = cart ? cart.items.filter((i) => i.product) : [];
    if (lines.length === 0) return res.status(400).json({ message: "Your cart is empty" });

    for (const l of lines) {
      if (l.product.stock < l.quantity) {
        return res.status(400).json({ message: `Not enough stock for "${l.product.title}"` });
      }
    }

    const items = lines.map((l) => ({
      product: l.product._id,
      title: l.product.title,
      price: l.product.price,
      quantity: l.quantity,
    }));
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({ user: req.user._id, items, total });
    for (const l of lines) {
      await Product.updateOne({ _id: l.product._id }, { $inc: { stock: -l.quantity } });
    }
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/mine
router.get("/mine", async (req, res, next) => {
  try {
    res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
