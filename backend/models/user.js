const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  owner: { type: Boolean, required: true },
  dispacherPercentage: { type: Number, required: true },
});
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
