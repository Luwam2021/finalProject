require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const app = express();
const mongoose = require("mongoose");
const userRouter = require(path.join(__dirname, "./routes/user"));
const diaryRouter = require(path.join(__dirname, "./routes/diary"));
const sendMail = require(path.join(__dirname, "./controllers/sendMail"));

const PORT = process.env.PORT || 4000;

// second*(optional) minute hour date month day
// it runs minute(10), hour (6 am), date(1,16), everymonth* ,any day of the week*
cron.schedule("1 59 6 1,16 * *", () => {
  console.log("running a task every minute");
  sendMail();
});
mongoose.connect(
  "mongodb+srv://luwam:Izzy183@izzy.eo9je.mongodb.net/drivers_diary?retryWrites=true&w=majority",
  (err) => {
    if (err) {
      console.log(`couldn't connect to db`);
    } else {
      console.log(`connected to db`);
    }
  }
);
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/users", userRouter);
app.use("/diaries", diaryRouter);
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    res.send({ success: false, msg: "error in database server" });
  }
});

app.listen(PORT);
