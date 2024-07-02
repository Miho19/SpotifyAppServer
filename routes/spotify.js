const express = require("express");
const { AppError } = require("../src/errors/AppError");
const {
  spotifyGetUserObject,
  spotifyRetrieveAllUserPlaylists,
  spotifyRetrievePlaylist,
} = require("../src/spotifyApi/spotifyUtility");
const { SpotifyUserManager } = require("../src/spotifyApi/SpotifyUserManager");
const { routerUtilityRetrieveUserObject } = require("./routerUtility");
const router = express.Router();

/**
 *
 * Routes for /spotify/users/:id
 *
 */

router.get("/users/:userID", (req, res) => {
  const userObject = routerUtilityRetrieveUserObject(req.session);

  if (!userObject) return res.status(404).send(new Error("User Not Found"));

  const spotifyUserObject = spotifyGetUserObject(userObject);

  res.status(200).json({ ...spotifyUserObject });
});

router.get("/users/:userID/playlists", async (req, res) => {
  const userObject = routerUtilityRetrieveUserObject(req.session);

  if (!userObject) return res.status(404).send(new Error("User Not Found"));

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

router.get("/users/:userID/playlists/:playlistID", async (req, res) => {
  const userObject = routerUtilityRetrieveUserObject(req.session);

  if (!userObject)
    throw new AppError(400, "User does not have a valid session");

  const spotifyUserManager = new SpotifyUserManager(userObject);
  const { playlistID } = req.params;

  try {
    const response = await spotifyRetrievePlaylist(
      spotifyUserManager,
      playlistID
    );

    return res.status(200).json(response);
  } catch (error) {
    throw new AppError(500, `Could not retrieve the playlist: ${playlistID}`);
  }
});

module.exports = router;
