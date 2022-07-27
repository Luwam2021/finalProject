const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const USER_CODE = "my_truck_diary";

exports.addUser = async (req, res) => {
  const exists = await UserModel.find({});

  const exist = await UserModel.findOne({ email: req.body.email });
  if (!exist) {
    const bcrypted = bcrypt.hashSync(req.body.password, 8);

    try {
      const newUser = await UserModel.create({
        ...req.body,
        password: bcrypted,
      });
      res.send({ success: true, msg: "signed up" });
    } catch (e) {
      res.send({ success: false, msg: "error in db" });
    }
  } else {
    res.send({ success: false, msg: "this email already has an account" });
  }
};
exports.signinUser = async (req, res) => {
  const { email, password } = req.body;
  const userInDB = await UserModel.findOne({ email });
  if (userInDB) {
    const isUser = bcrypt.compareSync(password, userInDB.password);
    if (isUser) {
      const { lName, email, phone, owner, dispacherPercentage, fName } =
        userInDB;
      const token = jwt.sign(
        { lName, email, phone, owner, dispacherPercentage, fName },
        "my_truck_diary"
      );
      res.send({
        success: true,
        msg: { token },
      });
    } else {
      res.send({ success: false, msg: "check your credentials" });
    }
  } else {
    res.send({ success: false, msg: "check your credentials" });
  }
};

exports.editUser = async (req, res, next) => {
  const email = req.params.email;
  const user = req.body;
  try {
    const updated = await UserModel.updateOne(
      { email: email },
      {
        $set: { phone: user.phone, fName: user.fName, lName: user.lName },
      }
    );
    const userInDB = await UserModel.findOne({ email });
    const { lName, phone, owner, dispacherPercentage, fName } = userInDB;
    const token = jwt.sign(
      {email, lName, phone, owner, dispacherPercentage, fName },
      USER_CODE
    );

    res.send({ success: true, msg: { token, msg: "updated" } });
  } catch (e) {
    next(e);
  }
};
