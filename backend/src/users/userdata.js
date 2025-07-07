import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const users = [
  {
    fullName: "ABC",
    email: "abc@gmail.com",
    password: "123456", 
    profilePic: "https://randomuser.me/api/portraits/lego/1.jpg",
  },
  {
    fullName: "DEF",
    email: "def@gmail.com",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/lego/5.jpg",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
        console.log("Inserted:", user.email);
      } else {
        console.log("Already exists:", user.email);
      }
    }

    console.log("Seeding complete.");
    process.exit();
  } catch (err) {
    console.error("Error seeding users:", err);
    process.exit(1);
  }
};

seed();
