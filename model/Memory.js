const mongoose = require("mongoose");

const MemorySchema = new mongoose.Schema({
  image: {
    type: String,
  },
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "trips",
  },
});

module.exports = mongoose.model("memories", MemorySchema);
