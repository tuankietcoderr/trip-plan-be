const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../model/User");
const verifyToken = require("../middleware/auth");
const Credential = require("../model/Credential");
const { Types } = require("mongoose");
const toId = Types.ObjectId;

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(new toId(req.user_id)).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(new toId(req.user_id));
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }
    const update = {
      ...user._doc,
      ...req.body,
    };
    const updatedUser = await User.findByIdAndUpdate(user._id, update, {
      new: true,
    });
    if (!updatedUser) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }
    res.json({ success: true, message: "User updated", user: updatedUser });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, password, full_name, image } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  try {
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const newUser = new User({
      username,
      full_name,
      image,
    });
    await newUser.save();

    const newCredential = new Credential({
      user_id: newUser._id,
      password,
    });
    await newCredential.save();

    const accessToken = jwt.sign(
      { user_id: newUser._id.toString() },
      process.env.JWT_SECRET
    );
    res.json({
      success: true,
      message: "User created",
      accessToken,
      user: newUser,
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username/password" });
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });

    const credential = await Credential.findOne({
      user_id: user._id,
    });

    if (!credential) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    if (credential.password !== password) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong password" });
    }

    const accessToken = jwt.sign(
      { user_id: user._id.toString() },
      process.env.JWT_SECRET
    );
    res.json({ success: true, message: "User logged in", accessToken, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
