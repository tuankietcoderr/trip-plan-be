const mongoose = require("mongoose");

const BudgetExpenseSchema = new mongoose.Schema({
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "trips",
  },
  name: {
    type: String,
  },
  expense: {
    type: Number,
  },
});

module.exports = mongoose.model("budget_expenses", BudgetExpenseSchema);
