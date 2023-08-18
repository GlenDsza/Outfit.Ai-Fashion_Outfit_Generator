const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { chatbotResponse } = require("../controllers/generatorController");

const router = express.Router();

router.route("/generator/respond").post(isAuthenticatedUser, chatbotResponse);

module.exports = router;
