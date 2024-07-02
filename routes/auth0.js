const express = require("express");
const { AppError } = require("../src/errors/AppError");
const router = express.Router();

const { _userAdd } = require("../src/utils");
const {
  spotifyConvertAuth0UserObjectToSpotifyUserObject,
} = require("../src/spotifyApi/spotifyUtility");
const { auth0CreateNewUserObject } = require("../src/Auth0/Auth0Utility");
const { routerUtilityRetrieveUserObject } = require("./routerUtility");

router.post("/", async (req, res, next) => {
  try {
    const userObject = routerUtilityRetrieveUserObject(req.session);

    if (userObject) {
      const spotifyUserObject =
        spotifyConvertAuth0UserObjectToSpotifyUserObject(userObject);
      return res.status(200).json({ ...spotifyUserObject });
    }

    const { auth0ID } = req.body;
    const { id: sessionID } = req.session;

    if (!auth0ID) throw new AppError(400, "Missing Auth0 User ID");

    const newAuth0UserObject = await auth0CreateNewUserObject(
      sessionID,
      auth0ID
    );
    // temp function to simulate adding to database
    _userAdd(newAuth0UserObject);

    const spotifyUserObject =
      spotifyConvertAuth0UserObjectToSpotifyUserObject(newAuth0UserObject);

    res.status(200).json({ ...spotifyUserObject });
  } catch (error) {
    if (error instanceof AppError) next(error);
  }
});

module.exports = router;
