const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    // "buyer" can shop, "seller" can add products, "admin" manages everything
    role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
