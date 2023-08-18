const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.chatbotResponse = asyncErrorHandler(async (req, res, next) => {
  const { message } = req.body;
  setTimeout(() => {
    res.status(201).json({
      success: true,
      message: "This is static response",
    });
  }, 2000);
});
