const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  place_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("favorites", FavoriteSchema);
