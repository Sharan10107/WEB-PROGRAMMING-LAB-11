
require("dotenv").config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);

async function createUser() {
  const [username, password] = process.argv.slice(2);

  if (!username || !password) {
    console.log("Usage: node create-user.js <username> <password>");
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingUser = await User.findOne({
      username: username.trim()
    });

    if (existingUser) {
      console.log("Username already exists.");
      process.exitCode = 1;
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      username: username.trim(),
      password_hash: passwordHash
    });

    console.log(`User "${username}" created successfully!`);

  } catch (error) {
    console.error("Could not create user:", error.message);
    process.exitCode = 1;

  } finally {
    await mongoose.disconnect();
  }
}

createUser();
