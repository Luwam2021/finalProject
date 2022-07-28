const express = require("express");
const path = require('path');
const router = express.Router();
const userController = require(path.join(__dirname,"../controllers/user"));
const diaryController = require(path.join(__dirname,"../controllers/diary"))

router.post("/signin", userController.signinUser);
router.post("/", userController.addUser);

router.patch("/:email",diaryController.authorizeUser, userController.editUser);



module.exports = router;
