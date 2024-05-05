const express = require("express");
const { AppError } = require("../src/errors/AppError");
const router = express.Router();

const { v4: uuid } = require("uuid");

const Auth0Manager = require("../src/Auth0/Auth0Manager");
const Auth0UserProfile = require("../src/Auth0/Auth0UserProfile");

const { UserGetBySessionID, _userAdd } = require("../src/utils");

router.post("/", async (req, res) => {
  const { id: sessionID } = req.session;
  const userObject = UserGetBySessionID(sessionID);

  if (userObject) {
    res.status(200).json({ ...userObject.publicUserObject });
    return;
  }

  const { auth0ID } = req.body;
  if (!auth0ID) throw new AppError(400, "Missing Auth0 User ID");

  try {
    const auth0Manager = new Auth0Manager();
    await auth0Manager.initialise();
    const userProfileManager = new Auth0UserProfile(auth0Manager, auth0ID);
    const userProfile = await userProfileManager.FetchUserProfile();

    const identityObject = userProfile.identities[0];

    const outUserObject = {
      spotifyUserID: identityObject.user_id,
      image: userProfile.images[1],
      displayName: userProfile.display_name,
    };

    const newUserObject = {
      id: uuid(),
      sessionID,
      auth0ID,
      privateUserObject: identityObject,
      publicUserObject: outUserObject,
    };

    // temp function to simulate adding to database
    _userAdd(newUserObject);

    res.status(200).json({ ...outUserObject });
  } catch (err) {
    res.status(500, "Error fetching user details");
  }
});

module.exports = router;
