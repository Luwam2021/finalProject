const express = require("express");
const router = express.Router();
const path = require('path');
const diaryController = require(path.join(__dirname,"../controllers/diary"));

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, `receipt${file.originalname}`);
  },
});

//PICTURE
const uploadPics = multer({ storage: storage });
router.post("/files", uploadPics.single("file"), diaryController.handleimg);


//LOADS
router.use(diaryController.authorizeUser)
router.post("/:email/loads", diaryController.addLoad);
router.get("/:email/loads", diaryController.getLoads);
router.delete("/:email/loads/:_id", diaryController.deleteLoad);
router.put("/:email/loads/:_id", diaryController.updateLoad);

//EXPENSE
// router.use(diaryController.authorizeUser)
router.get("/:email/expenses", diaryController.getExpenses);
router.post("/:email/expenses", diaryController.addExpense);
router.delete("/:email/expenses/:_id", diaryController.deleteExpense);
router.put("/:email/expenses/:_id", diaryController.updateExpense);

//INCOME
router.get("/:email/income",diaryController.getIncome)
module.exports = router;
