const express = require("express");
const { AppError } = require("../src/errors/AppError");
const router = express.Router();

const { _userAdd } = require("../src/utils");
const {
  spotifyConvertAuth0UserObjectToSpotifyUserObject,
} = require("../src/spotifyApi/spotifyUtility");
const { auth0CreateNewUserObject } = require("../src/Auth0/Auth0Utility");
const { routerUtilityRetrieveUserObject } = require("./routerUtility");

router.post("/", async (req, res) => {
  const userObject = routerUtilityRetrieveUserObject(req.session);

  if (userObject)
    return res.status(200).json({ ...userObject.publicUserObject });

  const { auth0ID } = req.body;
  const { id: sessionID } = req.session;

  if (!auth0ID) throw new AppError(400, "Missing Auth0 User ID");

  const newAuth0UserObject = await auth0CreateNewUserObject(sessionID, auth0ID);
  // temp function to simulate adding to database
  _userAdd(newAuth0UserObject);

  try {
    const spotifyUserObject =
      await spotifyConvertAuth0UserObjectToSpotifyUserObject(
        newAuth0UserObject
      );

    res.status(200).json({ ...spotifyUserObject });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
