const express = require("express");
const router = express.Router();
const { AppError } = require("../src/errors/AppError");

router.use((req, res, next) => {
  throw new AppError(404, "Not a route");
});

module.exports = router;
