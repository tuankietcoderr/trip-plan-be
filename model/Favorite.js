const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  place_id: {
    type: String,
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "places",
  },
});

module.exports = mongoose.model("favorites", FavoriteSchema);
