const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const generateToken = require("../config/generateToken");
const { authenticateUser } = require("../middleware/authMiddleware");

// sign up form submit karne ke baad
router.post("/register", async (req, res) => {
  try {
    let { username, email, password, picture } = req.body;

    if (!username || !email || !password) {
      return res.status(500).json({ message: "Enter all fields" });
    }

    const userFound = await User.findOne({ email });

    if (userFound) {
      return res.status(400).json({ message: "User already exists" });
    }

    password = await bcrypt.hash(password, 10);
    if (!picture) {
      picture = undefined; // triggers default in schema
    }
    const newUser = await User.create({ username, email, password, picture });

    if (newUser) {
      return res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        picture: newUser.picture,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// login form submit karne ke baad
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Enter all fields" });
    }

    const foundUser = await User.findOne({ email });

    if (foundUser) {
      let validatePass = await bcrypt.compare(password, foundUser.password);

      if (validatePass) {
        return res.status(200).json({
          _id: foundUser._id,
          username: foundUser.username,
          email: foundUser.email,
          picture: foundUser.picture,
          token: generateToken(foundUser._id),
        });
      } else {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// on searching any user in search field
router.get("/search", authenticateUser, async (req, res) => {
  try {
    const { search } = req.query;
    const keyword = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // return all users with name or email containing the search query, except the current user
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
