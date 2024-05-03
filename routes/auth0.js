const express = require("express");
const { AppError } = require("../src/errors/AppError");
const router = express.Router();

const { UserGetBySessionID } = require("../src/utils");

router.post("/", (req, res) => {
  console.log(req.body);
  const { id: sessionID } = req.session;
  const userObject = UserGetBySessionID(sessionID);

  if (userObject) {
    res.status(200).json({ ...userObject.spotifyUserObject });
    return;
  }

  res.status(200).json({ message: "this did not work" });
});

module.exports = router;
