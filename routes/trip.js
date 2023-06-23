const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");

const Trip = require("../model/Trip");
const User = require("../model/User");
const Place = require("../model/Place");
const Day = require("../model/Day");

const toId = require("mongodb").ObjectId;

router.get("/user", verifyToken, async (req, res) => {
  try {
    const trips = await Trip.find({
      user_id: new toId(req.user_id),
    }).populate("place_id");
    res.status(200).json({ success: true, trips });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const trip = await Trip.findById(new toId(req.params.id)).populate(
      "place_id"
    );
    if (!trip) {
      return res
        .status(400)
        .json({ success: false, message: "Trip does not exist" });
    }
    if (trip.user_id.toString() !== req.user_id) {
      return res.status(400).json({
        success: false,
        message: "You are not allow to view this trip",
      });
    }
    res.status(200).json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { name, start_at, end_at, destination, budget, place_id } = req.body;

  if (!name || !start_at || !end_at || !destination || !budget || !place_id)
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });

  try {
    const placeId = new toId(place_id);
    const place = await Place.findById(placeId);
    const newTrip = new Trip({
      name,
      start_at: new Date(start_at),
      end_at: new Date(end_at),
      user_id: new toId(req.user_id),
      place_id: placeId,
      budget: 500000,
      image: place.image,
    });
    await newTrip.save();
    // create day plans from trip id created
    const days = Math.ceil(
      (newTrip.end_at - newTrip.start_at) / (1000 * 60 * 60 * 24)
    );
    for (let i = 0; i < days; i++) {
      const newDay = new Day({
        name: `Day ${i + 1}`,
        trip_id: newTrip._id,
        date: new Date(newTrip.start_at.getTime() + i * (1000 * 60 * 60 * 24)),
      });
      await newDay.save();
    }
    res.json({
      success: true,
      message: "Trip created",
      trip: await newTrip.populate("place_id"),
    });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res
        .status(400)
        .json({ success: false, message: "Trip does not exist" });
    }
    if (trip.user_id.toString() !== req.user_id) {
      return res.status(400).json({
        success: false,
        message: "You are not allow to edit this trip",
      });
    }
    const update = {
      ...trip._doc,
      ...req.body,
    };
    const updatedTrip = await Trip.findByIdAndUpdate(trip._id, update, {
      new: true,
    }).populate("place_id");
    if (!updatedTrip) {
      return res
        .status(400)
        .json({ success: false, message: "Trip does not exist" });
    }
    res.json({ success: true, message: "Trip updated", trip: updatedTrip });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res
        .status(400)
        .json({ success: false, message: "Trip does not exist" });
    }
    if (trip.user_id.toString() !== req.user_id) {
      return res.status(400).json({
        success: false,
        message: "You are not allow to delete this trip",
      });
    }
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Delete trip successfully",
      deletedId: deletedTrip._id,
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
