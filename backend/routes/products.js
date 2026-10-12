const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadBuffer, cloudinary } = require("../config/cloudinary");

const router = express.Router();

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/products?search=shoe  -> public list
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) {
      filter.title = { $regex: String(req.query.search).slice(0, 50), $options: "i" };
    }
    const products = await Product.find(filter).populate("seller", "name").sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/mine  -> seller's own products
router.get("/mine", protect, authorize("seller", "admin"), async (req, res, next) => {
  try {
    res.json(await Product.find({ seller: req.user._id }).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid product id" });
    const product = await Product.findById(req.params.id).populate("seller", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products  (seller or admin) with optional image field named "image"
router.post("/", protect, authorize("seller", "admin"), upload.single("image"), async (req, res, next) => {
  try {
    const { title, description, price, stock, category } = req.body;
    if (!title || price === undefined || price === "") {
      return res.status(400).json({ message: "Title and price are required" });
    }
    if (Number(price) < 0 || Number.isNaN(Number(price))) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }
    let imageUrl = "";
    let imageId = "";
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer);
      imageUrl = result.secure_url;
      imageId = result.public_id;
    }
    const product = await Product.create({
      title,
      description,
      price: Number(price),
      stock: stock === undefined || stock === "" ? 1 : Number(stock),
      category: category || "general",
      imageUrl,
      imageId,
      seller: req.user._id,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id  (owner or admin)
router.put("/:id", protect, authorize("seller", "admin"), async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid product id" });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (req.user.role !== "admin" && !product.seller.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own products" });
    }
    const { title, description, price, stock, category } = req.body;
    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (category !== undefined) product.category = category;
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id  (owner or admin)
router.delete("/:id", protect, authorize("seller", "admin"), async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid product id" });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (req.user.role !== "admin" && !product.seller.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own products" });
    }
    if (product.imageId) {
      try {
        await cloudinary.uploader.destroy(product.imageId);
      } catch (e) {
        console.error("Cloudinary delete failed:", e.message);
      }
    }
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
