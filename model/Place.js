const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
  },
});

module.exports = mongoose.model("places", PlaceSchema);
