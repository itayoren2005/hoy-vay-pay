const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getTotalExpenses,
} = require("../controllers/expense");

router.post("/add-expense/:userId", addExpense);
router.get("/get-expenses/:userId", getExpenses);
router.patch("/update-expense/:userId/:incomeId", updateExpense);
router.delete("/delete-expense/:userId/:incomeId", deleteExpense);
router.get("/get-total-expenses/:userId", getTotalExpenses);

module.exports = router;
