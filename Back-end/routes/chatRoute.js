const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const userAuthentication = require("../middleware/auth");


router.post("/sendMessage", userAuthentication.authenticate, chatController.sendMessage);
router.get("/getMessages", userAuthentication.authenticate,chatController.getMessages);
module.exports = router;