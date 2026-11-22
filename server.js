
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

app.set("trust proxy", 1);

const PORT = Number(process.env.PORT || 3000);

if (!process.env.SESSION_SECRET || !process.env.MONGODB_URI) {
  console.error("SESSION_SECRET or MONGODB_URI is missing in .env");
  process.exit(1);
}

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password_hash: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  name: "login.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 60 * 1000
  }
}));

app.use(express.static(path.join(__dirname, "public")));

// CREATE ACCOUNT API
app.post("/api/register", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields."
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Username must contain at least 3 characters."
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email address."
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 8 characters."
    });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      username,
      email,
      password_hash: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully! Please log in.",
      redirect: "/index.html"
    });

  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create account. Please try again."
    });
  }
});

// LOGIN API
app.post("/api/login", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Enter both username and password."
    });
  }

  try {
    const user = await User.findOne({ username });

    const passwordMatches = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password."
      });
    }

    req.session.user = {
      id: user._id.toString(),
      username: user.username
    };

    return res.json({
      success: true,
      message: "Login successful.",
      redirect: "/welcome.html"
    });

  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process login right now."
    });
  }
});

// CHECK LOGGED-IN USER
app.get("/api/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      authenticated: false
    });
  }

  res.json({
    authenticated: true,
    username: req.session.user.username
  });
});

// LOGOUT API
app.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Could not log out."
      });
    }

    res.clearCookie("login.sid");

    res.json({
      success: true
    });
  });
});

// START SERVER
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected successfully!");

    await User.init();

    app.listen(PORT, () => {
      console.log(`Login application running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
