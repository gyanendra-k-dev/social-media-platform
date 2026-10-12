const express = require("express");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect); // every cart route needs login

const loadCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  return cart || { items: [] };
};

// GET /api/cart
router.get("/", async (req, res, next) => {
  try {
    res.json(await loadCart(req.user._id));
  } catch (err) {
    next(err);
  }
});

// POST /api/cart  { productId, quantity }
router.post("/", async (req, res, next) => {
  try {
    const { productId } = req.body;
    const quantity = Math.max(1, parseInt(req.body.quantity) || 1);
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const line = cart.items.find((i) => i.product.equals(productId));
    if (line) line.quantity += quantity;
    else cart.items.push({ product: productId, quantity });
    await cart.save();

    res.status(201).json(await loadCart(req.user._id));
  } catch (err) {
    next(err);
  }
});

// PUT /api/cart/:productId  { quantity }
router.put("/:productId", async (req, res, next) => {
  try {
    const quantity = parseInt(req.body.quantity);
    if (!quantity || quantity < 1) return res.status(400).json({ message: "Quantity must be 1 or more" });
    const cart = await Cart.findOne({ user: req.user._id });
    const line = cart && cart.items.find((i) => i.product.equals(req.params.productId));
    if (!line) return res.status(404).json({ message: "Item not in cart" });
    line.quantity = quantity;
    await cart.save();
    res.json(await loadCart(req.user._id));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/:productId
router.delete("/:productId", async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter((i) => !i.product.equals(req.params.productId));
      await cart.save();
    }
    res.json(await loadCart(req.user._id));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
