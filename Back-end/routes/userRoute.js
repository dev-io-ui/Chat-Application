const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const userAuthentication = require("../middleware/auth");

router.get("/", userController.getLoginPage);
router.post("/sign-up" ,userController.postUserSignUp);
router.post("/login" , userController.postUserLogin);

module.exports = router;