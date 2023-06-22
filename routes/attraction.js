const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");

const Attraction = require("../model/Attraction");
const Day = require("../model/Day");

const toId = require("mongodb").ObjectId;

router.get("/", verifyToken, async (req, res) => {
  try {
    const dayId = new toId(req.query.day_id);
    const attractions = await Attraction.find({ day_id: dayId });
    res.status(200).json({ success: true, attractions });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { day_id, location_name, address, time } = req.body;

  if (!day_id || !location_name || !address || !time)
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });

  try {
    const newAttraction = new Attraction({
      day_id: new toId(day_id),
      location_name,
      address,
      time: new Date(time),
    });
    await newAttraction.save();
    await Day.findByIdAndUpdate(
      newAttraction.day_id,
      {
        $push: { attractions: newAttraction._id },
      },
      { new: true }
    );
    res.status(200).json({ success: true, newAttraction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) {
      return res
        .status(400)
        .json({ success: false, message: "Attraction does not exist" });
    }
    const deletedAttraction = await Attraction.findByIdAndDelete(req.params.id);
    await Day.findByIdAndUpdate(
      deletedAttraction.day_id,
      {
        $pull: { attractions: deletedAttraction._id },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      deletedId: deletedAttraction._id,
      message: "Delete attraction success",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
