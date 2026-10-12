// Creates ONE admin using ADMIN_EMAIL / ADMIN_PASSWORD from your environment.
// Run it once:  npm run seed:admin   (no password is stored in the code)
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

(async () => {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD first.");
    process.exit(1);
  }
  if (ADMIN_PASSWORD.length < 10) {
    console.error("Use an ADMIN_PASSWORD with at least 10 characters.");
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  const email = ADMIN_EMAIL.toLowerCase();
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("A user with this email already exists. Nothing changed.");
  } else {
    await User.create({
      name: ADMIN_NAME || "Admin",
      email,
      password: await bcrypt.hash(ADMIN_PASSWORD, 10),
      role: "admin",
    });
    console.log("Admin created:", email);
  }
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
