const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user_controller");

router.post("/register", UserController.registerUser);

router.post("/login", UserController.loginUser);

module.exports = router;