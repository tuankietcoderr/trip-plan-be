const mongoose = require("mongoose");

const AttractionSchema = new mongoose.Schema({
  location_name: {
    type: String,
  },
  address: {
    type: String,
  },
  time: {
    type: String,
  },
  day_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "days",
  },
});

module.exports = mongoose.model("attractions", AttractionSchema);
