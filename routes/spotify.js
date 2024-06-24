const express = require("express");
const { UserGetBySessionID } = require("../src/utils");
const { AppError } = require("../src/errors/AppError");
const {
  spotifyGetUserObject,
  spotifyRetrieveAllUserPlaylists,
} = require("../src/spotifyApi/spotifyUtility");
const { SpotifyUserManager } = require("../src/spotifyApi/SpotifyUserManager");
const router = express.Router();

/**
 *
 * Routes for /spotify/users/:id
 *
 */

router.get("/users/:userID", (req, res) => {
  const { id: userSessionID } = req.session;
  const userObject = UserGetBySessionID(userSessionID);

  if (!userObject)
    throw new AppError(400, "User does not have a valid session");

  const spotifyUserObject = spotifyGetUserObject(userObject);

  res.status(200).json({ ...spotifyUserObject });
});

router.get("/users/:userID/playlists", async (req, res) => {
  const { id: userSessionID } = req.session;
  const userObject = UserGetBySessionID(userSessionID);

  if (!userObject)
    throw new AppError(400, "User does not have a valid session");

  const spotifyUserManager = new SpotifyUserManager(userObject);
  const queryID = req.params.userID;

  try {
    const response = await spotifyRetrieveAllUserPlaylists(
      spotifyUserManager,
      queryID
    );
    return res.status(200).json(response);
  } catch (error) {
    throw new AppError(500, "Could not retrieve user all playlists");
  }
});

module.exports = router;
