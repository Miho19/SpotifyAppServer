const express = require("express");
const { UserGetBySessionID } = require("../src/utils");
const { AppError } = require("../src/errors/AppError");
const router = express.Router();

router.get("/", (req, res) => {
  const { id: userSessionID } = req.session;
  const userObject = UserGetBySessionID(userSessionID);

  if (!userObject)
    throw new AppError(400, "User does not have a valid session");

  console.log(userObject);
});

module.exports = router;
