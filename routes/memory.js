const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");

const Memory = require("../model/Memory");

const toId = require("mongodb").ObjectId;

router.get("/", verifyToken, async (req, res) => {
  try {
    const tripId = new toId(req.query.trip_id);
    const memories = await Memory.find({
      trip_id: tripId,
    });
    res.status(200).json({ success: true, memories });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { trip_id, image } = req.body;

  if (!trip_id || !image)
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });

  try {
    const newMemory = new Memory({
      trip_id: new toId(trip_id),
      image,
    });
    await newMemory.save();
    res.status(200).json({ success: true, newMemory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res
        .status(400)
        .json({ success: false, message: "Memory does not exist" });
    }
    const deletedMemory = await Memory.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      deletedId: deletedMemory._id,
      message: "Delete memory success",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
