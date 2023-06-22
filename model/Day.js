const mongoose = require("mongoose");

const DaySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
  },
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "trips",
  },
  attractions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "attractions",
    },
  ],
});

module.exports = mongoose.model("days", DaySchema);
