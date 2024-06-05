const express = require("express");
const { AppError } = require("../src/errors/AppError");
const router = express.Router();

const { v4: uuid } = require("uuid");

const { UserGetBySessionID, _userAdd } = require("../src/utils");
const { spotifyGetUserObject } = require("../src/spotifyApi/spotifyUtility");
const { auth0CreateNewUserObject } = require("../src/Auth0/Auth0Utility");

router.post("/", async (req, res) => {
  const { id: sessionID } = req.session;
  const userObject = UserGetBySessionID(sessionID);

  if (userObject) {
    res.status(200).json({ ...userObject.publicUserObject });
    return;
  }

  const { auth0ID } = req.body;
  if (!auth0ID) throw new AppError(400, "Missing Auth0 User ID");

  const newAuth0UserObject = await auth0CreateNewUserObject(sessionID, auth0ID);
  // temp function to simulate adding to database
  _userAdd(newAuth0UserObject);

  const spotifyUserObject = await spotifyGetUserObject(newAuth0UserObject);

  res.status(200).json({ ...spotifyUserObject });
});

module.exports = router;
