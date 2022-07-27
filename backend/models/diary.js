const mongoose = require("mongoose");
const diarySchema = mongoose.Schema({
  email: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  expenses: [
    {
      reason: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, required: true },
      picture: { type: String },
    },
  ],
  loads: [
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
      loadNumber: { type: String, required: true },
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
      picture: { type: String, required: true },
    },
  ],
  income: {
    dispatcherShare: { type: Number },
    grossAmount: { total: { type: Number }, count: { type: String } },
    driver_share: { type: Number },
    gross_payable: { type: Number },
    income_over_expense: { type: Number },
    netSettlement: { type: Number },
    expensesObj: {
      fuel: { total: { type: Number }, count: { type: String } },
      keep_tracking: { total: { type: Number }, count: { type: String } },
      insurance: { total: { type: Number }, count: { type: String } },
      other: { total: { type: Number }, count: { type: String } },
    },
  },
});
const DiaryModel = mongoose.model("diary", diarySchema);
module.exports = DiaryModel;
