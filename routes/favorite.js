const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");
const mongoose = require("mongoose");
const Favorite = require("../model/Favorite");

const toId = mongoose.Types.ObjectId;

router.get("/user", verifyToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user_id: new toId(req.user_id),
    }).populate("place_id");
    res.status(200).json({ success: true, favorites });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { place_id } = req.body;

  if (!place_id)
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });

  try {
    const placeId = new toId(place_id);
    const favorite = await Favorite.findOne({
      user_id: new toId(req.user_id),
      place_id: placeId,
    });
    if (favorite) {
      return res.status(400).json({
        success: false,
        message: "You have add this favorite already",
      });
    }
    const newFavorite = new Favorite({
      user_id: new toId(req.user_id),
      place_id: placeId,
    });
    await newFavorite.save();
    res.status(200).json({
      success: true,
      newFavorite,
      message: "Add favorite success",
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    if (!favorite) {
      return res
        .status(400)
        .json({ success: false, message: "Favorite does not exist" });
    }
    if (favorite.user_id.toString() !== req.user_id) {
      return res.status(400).json({
        success: false,
        message: "You are not allow to delete this favorite",
      });
    }

    const deletedFavorite = await Favorite.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      deletedId: deletedFavorite._id,
      message: "Remove favorite success",
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
