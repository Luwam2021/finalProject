const path = require('path');
const DiaryModel = require(path.join(__dirname,"../models/diary"));
const UserModel = require(path.join(__dirname,"../models/user"));
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const jwt = require("jsonwebtoken");
const USER_CODE = "my_truck_diary";

exports.handleimg = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next("error");
  }
  res.send({ success: true, msg: file });
};
//authorization

exports.authorizeUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, USER_CODE, (err, user) => {
      if (err) {
        next(err);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
};

//GET ENDDATE FOR SEARCHING DIARY
function getDates(req,optional) {
  let endDate = null;

  const email = req.params.email;
  let newDate = null;
  if (req.body.date) {
    newDate = new Date(req.body.date);
  } else {
    newDate = new Date(req.query.date);
  }

  let mm = newDate.getMonth() + 1;
  let yy = newDate.getFullYear();
  let d = new Date(yy, mm, 0).getDate();
  let startDate = null;
  if (newDate.getDate() <= 15) {
    endDate = `${newDate.getMonth() + 1}/15/${newDate.getFullYear()}`;
    startDate = `${newDate.getMonth()+1}/1/${newDate.getFullYear()}`;
  } else {
    endDate = `${newDate.getMonth() + 1}/${d}/${newDate.getFullYear()}`;
    startDate = `${newDate.getMonth() + 1}/16/${newDate.getFullYear()}`;
  }
  return { startDate, endDate, email };
}
//CHECK IF DIARY IS OPENED FOR SPECIFIC DATE AND CREATE ONE OF NOT
async function checkDiaryExistense(startDate, endDate, email) {
  const diaryExists = await DiaryModel.findOne({ email, endDate });
  if (!diaryExists) {
    const newDiary = {
      email,
      endDate,
      startDate,
      loads: [],
      expenses: [],
      income: {
        dispatcherShare: 0.0,
        driver_share: 0.0,
        grossAmount: {},
        gross_payable: 0.0,
        income_over_expense: 0.0,
        netSettlement: 0.0,
        expensesObj: {},
      },
    };

    await DiaryModel.create(newDiary);
  }
}
//ADD LOAD
exports.addLoad = async (req, res) => {
  const newDate = new Date(req.body.date);
  const { startDate, endDate, email } = getDates(req);
  await checkDiaryExistense(startDate, endDate, email);
  const load = req.body;
  const loadExists = await DiaryModel.findOne({
    email,
    endDate,
    "loads.date": newDate,
    "loads.loadNumber": load.loadNumber,
  });
  if (!loadExists) {
    await DiaryModel.updateOne({ email, endDate }, { $push: { loads: load } });
    res.send({ success: true, msg: "load successfully added" });
  } else {
    res.send({ success: false, msg: "this load is already in database" });
  }
};
//GET LOADS
exports.getLoads = async (req, res) => {
  const { startDate, endDate, email } = getDates(req);
  await checkDiaryExistense(startDate, endDate, email);
  const loads = (await DiaryModel.findOne({ email, endDate })).loads;
  res.send({ success: true, msg: { endDate, loads, startDate } });
};
exports.deleteLoad = async (req, res) => {
  const endDate = new Date(req.query.endDate);
  const { _id, email } = req.params;
  try {
    await DiaryModel.updateOne(
      { email, endDate },
      { $pull: { loads: { _id: _id } } }
    );
    res.send({ success: true, msg: "deleted" });
  } catch (e) {
    res.send({ success: false, msg: "something went wrong" });
  }
};
exports.updateLoad = async (req, res) => {
  const endDate = new Date(req.query.endDate);
  const { email, _id } = req.params;
  const body = req.body;
  try {
    const update = await DiaryModel.updateOne(
      { email, endDate, "loads._id": _id },
      {
        $set: {
          "loads.$.from": body.from,
          "loads.$.to": body.to,
          "loads.$.loadNumber": body.loadNumber,
          "loads.$.amount": body.amount,
        },
      }
    );
    if (update.acknowledged) {
      res.send({ success: true, msg: "updated" });
    } else {
      res.send({ success: true, msg: "there was no change" });
    }
  } catch (e) {
    res.send({ success: false, msg: "error in database" });
  }
};
exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, email } = getDates(req);
    await checkDiaryExistense(startDate, endDate, email);
    const expenses = (await DiaryModel.findOne({ email, endDate })).expenses;
    res.send({ success: true, msg: { endDate, expenses, startDate } });
  } catch (e) {
    res.send({ success: false, msg: "error in database" });
  }
};
exports.addExpense = async (req, res) => {
  const newDate = new Date(req.body.date);
  const { startDate, endDate, email } = getDates(req);
  try {
    await checkDiaryExistense(startDate, endDate, email);
    const expense = req.body;
    await DiaryModel.updateOne(
      { email, endDate },
      { $push: { expenses: expense } }
    );
    res.send({ success: true, msg: "expense successfully added" });
  } catch (e) {
    res.send({ success: false, msg: "error in database" });
  }
};

exports.updateExpense = async (req, res) => {
  const endDate = req.query.endDate;
  const { email, _id } = req.params;
  const body = req.body;
  try {
    const found = await DiaryModel.findOne({
      email,
      endDate,
      "expenses._id": _id,
    });
    const update = await DiaryModel.updateOne(
      { email, endDate, "expenses._id": _id },
      {
        $set: {
          "expenses.$.reason": body.reason,
          "expenses.$.picture": body.picture,
          "expenses.$.amount": body.amount,
        },
      }
    );
    if (update.acknowledged) {
      res.send({ success: true, msg: "updated" });
    } else {
      res.send({ success: true, msg: "there was no change" });
    }
  } catch (e) {
    res.send({ success: false, msg: "error in database " });
  }
};
exports.deleteExpense = async (req, res) => {
  const endDate = new Date(req.query.endDate);
  const { _id, email } = req.params;
  try {
    await DiaryModel.updateOne(
      { email, endDate },
      { $pull: { expenses: { _id: _id } } }
    );
    res.send({ success: true, msg: "deleted" });
  } catch (e) {
    res.send({ success: false, msg: "something went wrong" });
  }
};
exports.getIncome = async (req, res) => {
  const { endDate, email } = getDates(req);

  try {
    const user = await UserModel.findOne({ email });
    const diary = await DiaryModel.findOne({ email, endDate });

    if (user && diary) {
      const calculatedIncome = this.calcIncome(user, diary);
      res.send({
        success: true,
        msg: {
          income: calculatedIncome,
        },
      });
    }
  } catch (e) {
    res.send({ success: false, msg: "error in database" });
  }
};
exports.calcIncome = (user, diary) => {
  let fuel = { total: 0, count: 0 };
  insurance = { total: 0, count: 0 };
  keep_tracking = { total: 0, count: 0 };
  other = { total: 0, count: 0 };
  for (let expense of diary.expenses) {
    switch (expense.reason) {
      case "fuel":
        fuel.total += expense.amount;
        fuel.count += 1;
        break;
      case "insurance":
        insurance.total += expense.amount;
        insurance.count += 1;
        break;
      case "keep_tracking":
        keep_tracking.total += expense.amount;
        keep_tracking.count += 1;
        break;
      default:
        other.total += expense.amount;
        other.count += 1;
        break;
    }
  }
  let driver_share = 100;
  if (!user.owner) {
    driver_share = 50;
  }
  let grossAmount = { total: 0, count: diary.loads.length };
  for (let load of diary.loads) {
    grossAmount.total += load.amount;
  }
  const dispatcherShare = (user.dispacherPercentage / 100) * grossAmount.total;
  const gross_payable = grossAmount.total - dispatcherShare;
  const allExpense =
    fuel.total + insurance.total + keep_tracking.total + other.total;
  const income_over_expense = gross_payable - allExpense;
  const netSettlement = (driver_share / 100) * income_over_expense;
  const expensesObj = { fuel, keep_tracking, insurance, other };
  return {
    dispatcherShare,
    driver_share,
    grossAmount,
    gross_payable,
    income_over_expense,
    netSettlement,
    expensesObj,
  };
};
