const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  full_name: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("users", UserSchema);
