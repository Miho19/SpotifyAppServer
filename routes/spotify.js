const express = require("express");
const { AppError } = require("../src/errors/AppError");
const {
  spotifyGetUserObject,
  spotifyRetrieveAllUserPlaylists,
  spotifyRetrievePlaylist,
} = require("../src/spotifyApi/spotifyUtility");
const { SpotifyUserManager } = require("../src/spotifyApi/SpotifyUserManager");
const {
  routerUtilityRetrieveUserObject,
  routerControllerHandler,
} = require("./routerUtility");
const router = express.Router();

/**
 *
 * Routes for /spotify/users/:id
 *
 */

router.get("/users/:userID", async (req, res, next) => {
  await routerControllerHandler(() => {
    const userObject = routerUtilityRetrieveUserObject(req.session);

    if (!userObject) return res.status(404).send(new Error("User Not Found"));

    const spotifyUserObject = spotifyGetUserObject(userObject);

    res.status(200).json({ ...spotifyUserObject });
  }, next);
});

router.get("/users/:userID/playlists", async (req, res, next) => {
  await routerControllerHandler(async () => {
    const userObject = routerUtilityRetrieveUserObject(req.session);

    if (!userObject) return res.status(404).send(new Error("User Not Found"));

    const spotifyUserManager = new SpotifyUserManager(userObject);
    const queryID = req.params.userID;

    const response = await spotifyRetrieveAllUserPlaylists(
      spotifyUserManager,
      queryID
    );

    return res.status(200).json(response);
  }, next);
});

router.get("/users/:userID/playlists/:playlistID", async (req, res, next) => {
  await routerControllerHandler(async () => {
    const userObject = routerUtilityRetrieveUserObject(req.session);

    if (!userObject)
      throw new AppError(400, "User does not have a valid session");

    const spotifyUserManager = new SpotifyUserManager(userObject);
    const { playlistID } = req.params;

    const response = await spotifyRetrievePlaylist(
      spotifyUserManager,
      playlistID
    );

    return res.status(200).json(response);
  }, next);
});

module.exports = router;
