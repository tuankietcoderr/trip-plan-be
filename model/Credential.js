const mongoose = require("mongoose");

const CredentialSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("credentials", CredentialSchema);
