const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");

const BudgetExpense = require("../model/BudgetExpense");

const toId = require("mongodb").ObjectId;

router.get("/", verifyToken, async (req, res) => {
  try {
    const tripId = new toId(req.query.trip_id);
    const budgetExpenses = await BudgetExpense.find({
      trip_id: tripId,
    });
    res.status(200).json({ success: true, budgetExpenses });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { trip_id, name, expense } = req.body;

  if (!trip_id || !name || !expense)
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });

  try {
    const newBudgetExpense = new BudgetExpense({
      trip_id: new toId(trip_id),
      name,
      expense,
    });
    await newBudgetExpense.save();
    res.status(200).json({ success: true, newBudgetExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const budgetExpense = await BudgetExpense.findById(req.params.id);
    if (!budgetExpense) {
      return res
        .status(400)
        .json({ success: false, message: "Budget expense does not exist" });
    }
    const deletedBudgetExpense = await BudgetExpense.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json({
      success: true,
      deletedId: deletedBudgetExpense._id,
      message: "Delete budget expense success",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
