const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");
const Day = require("../model/Day");
const toId = require("mongodb").ObjectId;

router.get("/", verifyToken, async (req, res) => {
  try {
    const tripId = new toId(req.query.trip_id);
    const day = await Day.find({ trip_id: tripId }).populate("attractions");
    res.status(200).json({ success: true, day });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { trip_id, date, name } = req.body;

  if (!trip_id || !date || !name)
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });

  try {
    const newDay = new Day({
      trip_id: new toId(trip_id),
      date: new Date(date),
      name,
    });
    await newDay.save();
    res.status(200).json({ success: true, newDay });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const day = await Day.findById(req.params.id);
    if (!day) {
      return res
        .status(400)
        .json({ success: false, message: "Day does not exist" });
    }
    const deletedDay = await Day.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      deletedId: deletedDay._id,
      message: "Delete day success",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
