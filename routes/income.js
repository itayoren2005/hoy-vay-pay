const express = require("express");
const router = express.Router();

const {
  addIncome,
  getIncomes,
  updateIncome,
} = require("../controllers/income");

router.post("/add-income/:userId", addIncome);
router.get("/get-incomes/:userId", getIncomes);
router.patch("/update-income/:userId/:incomeId", updateIncome);

module.exports = router;
