const express = require("express");
const { UserGetBySessionID } = require("../src/utils");
const { AppError } = require("../src/errors/AppError");
const { spotifyGetUserObject } = require("../src/spotifyApi/spotifyUtility");
const router = express.Router();

/**
 *
 * Routes for /spotify/users/:id
 *
 */

router.get("/users/:userID", (req, res) => {
  const { userID: userSessionID } = req.session;
  const userObject = UserGetBySessionID(userSessionID);

  if (!userObject)
    throw new AppError(400, "User does not have a valid session");

  const spotifyUserObject = spotifyGetUserObject(userObject);

  res.status(200).json({ ...spotifyUserObject });
});

router.get("/users/:userID/playlists", (req, res) => {
  const { userID: userSessionID } = req.session;
  const userObject = UserGetBySessionID(userSessionID);

  return res.status(200).json({ error: "should not be here" });
  if (!userObject)
    throw new AppError(400, "User does not have a valid session");
});

module.exports = router;
