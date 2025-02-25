const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
      required: true,
      enum: ["salary", "bonus", "gift", "other"],
    },
    currency: {
      type: String,
      required: true,
      default: "ILS",
      enum: ["ILS", "USD", "EUR"],
    },
    exchangedAmount: {
      //the exchange rate to ILS
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
