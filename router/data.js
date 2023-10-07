const express = require("express");
const authenticateUser = require("../auth/user");
const {getAllData, generateChat, editChat, deleteChat} = require("../controller/data");


const router = express.Router();

router.get("/", authenticateUser, getAllData);
router.post("/generate", generateChat)
router.post('/editchat', editChat);
router.post('/delete', deleteChat);



module.exports = router;