const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expense");

router.post("/add-expense/:userId", addExpense);
router.get("/get-expenses/:userId", getExpenses);
router.patch("/update-expense/:userId/:incomeId", updateExpense);
router.delete("/delete-expense/:userId/:incomeId", deleteExpense);

module.exports = router;
