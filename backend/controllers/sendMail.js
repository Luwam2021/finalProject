const PDFDocument = require("pdfkit");
const fs = require("fs");
const UserModel = require("../models/user");
const DiaryModel = require("../models/diary");
const diaryController = require("./diary");
const nodemailer = require("nodemailer");
const EMAIL_ADDRESS = "bagum2022@outlook.com";
const PASSWORD = "REACT2022";
function pushNot(driver, endDate) {
  console.log(driver.email, "11");
  let mailOptions = {
    from: EMAIL_ADDRESS,
    to: `${driver.email}`,
    subject: `driver diary ending ${endDate}`,
    text: `the pdf file attached is your last statment`,
    attachments: [
      {
        path: `./${driver.email}/truckDiary.pdf`,
      },
    ],
  };
  let transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: EMAIL_ADDRESS,
      pass: PASSWORD,
    },
  });
  transporter.sendMail(mailOptions, function (error, info) {
    try {
      fs.rmdirSync(driver.email, { recursive: true });

      console.log(`${driver.email} is deleted!`);
    } catch (err) {
      console.error(`Error while deleting ${driver.email}.`);
    }
    console.log("31".driver.email);
    if (error) {
      console.log(error);
      const endDate = calcDate();
      //const endDate = `7/31/2022`;
      mail(driver, endDate, 3);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function calcDate() {
  const newDate = new Date();
  let endDate = "";
  let yy = 0;
  let mm = 0;
  let dd = 0;
  let currentmm = newDate.getMonth() + 1;
  let currentdd = newDate.getDate();
  let currentyy = newDate.getFullYear();
  if (currentdd === 1) {
    if (currentmm === 1) {
      mm = 12;
      yy = currentyy - 1;
    } else {
      mm = currentmm;
      yy = currentyy;
    }
    dd = new Date(yy, mm, 0).getDate();
  } else {
    mm = currentmm;
    dd = 15;
    yy = currentyy;
  }
  endDate = `${mm}/${dd}/${yy}`;
  return endDate;
}
async function sendMailer() {
  //let endDate = calcDate()
  let endDate = `7/31/2022`;

  const users = await UserModel.find({});
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    mail(user, endDate, i);
  }
}
async function mail(user, endDate, i) {
  const diary = await DiaryModel.findOne({ email: user.email, endDate });
  if (!diary) {
    return;
  }
  const income = diaryController.calcIncome(user, diary, i);
  const message = `Your income for the past half month ending ${endDate} is as follows.
gross payment = ${income.grossAmount.total},
dispatcher's share = ${income.dispatcherShare},
expenses = fuel(${income.expensesObj.fuel.total}), keep_tracking=(${income.expensesObj.keep_tracking.total}),
insurance (${income.expensesObj.insurance.total}), and others(${income.expensesObj.other.total}),
income over expense = (${income.income_over_expense}),
your share =${income.driver_share},
overall income = ${income.netSettlement}`;
  createPdf(user, message);
  setTimeout(() => {
    pushNot(user, endDate);
  }, (i + 1) * 2000);
}

function createPdf(user, message) {
  fs.mkdirSync(user.email);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(`./${user.email}/truckDiary.pdf`));
  doc.fontSize(27).text(message, 70, 70);
  doc.end();
}

module.exports = sendMailer;
