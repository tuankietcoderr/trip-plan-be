const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  destination: {
    type: String,
  },
  start_at: {
    type: Date,
  },
  end_at: {
    type: Date,
  },
  budget: {
    type: Number,
  },
  name: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  place_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "places",
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("trips", TripSchema);
