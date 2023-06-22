const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  place_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "places",
  },
});

module.exports = mongoose.model("favorites", FavoriteSchema);
