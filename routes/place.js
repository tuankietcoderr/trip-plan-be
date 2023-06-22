const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/auth");
const Place = require("../model/Place");

router.get("/", verifyToken, async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json({ success: true, places });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    res.status(200).json({ success: true, place });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { name, description, image, address, types } = req.body;

  if (!name || !description || !image || !address || !types)
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  try {
    const newPlace = new Place({
      name,
      description,
      image,
      address,
      types,
    });
    await newPlace.save();
    res.json({ success: true, message: "Place created", place: newPlace });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    const placeUpdate = {
      ...place._doc,
      ...req.body,
    };
    const placeUpdateCondition = { _id: req.params.id };
    const updatedPlace = await Place.findOneAndUpdate(
      placeUpdateCondition,
      placeUpdate,
      { new: true }
    );
    if (!updatedPlace)
      return res
        .status(401)
        .json({ success: false, message: "Place not found" });
    res.json({ success: true, message: "Place updated", place: updatedPlace });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const placeDeleteCondition = { _id: req.params.id };
    const deletedPlace = await Place.findOneAndDelete(placeDeleteCondition);
    if (!deletedPlace)
      return res
        .status(401)
        .json({ success: false, message: "Place not found" });
    res.json({
      success: true,
      message: "Place deleted",
      deletedId: deletedPlace._id,
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
