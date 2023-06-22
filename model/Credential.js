const mongoose = require("mongoose");

const CredentialSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("credentials", CredentialSchema);
