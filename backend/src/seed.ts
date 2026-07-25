import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const ADMIN_EMAIL = "admin123@gmail.com";
const ADMIN_PASSWORD = "admin123";

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined. Check your .env file.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const existingUser = await User.findOne({ email: ADMIN_EMAIL });

  if (existingUser) {
    existingUser.password = ADMIN_PASSWORD;
    await existingUser.save();
    console.log(`Updated existing admin user: ${ADMIN_EMAIL}`);
  } else {
    await User.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin" });
    console.log(`Created new admin user: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
  console.log("Done. Disconnected from MongoDB.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
