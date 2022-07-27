const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const diaryController = require("../controllers/diary")

router.post("/signin", userController.signinUser);
router.post("/", userController.addUser);

router.patch("/:email",diaryController.authorizeUser, userController.editUser);



module.exports = router;
