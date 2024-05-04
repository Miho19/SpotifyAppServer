const express = require("express");
const { AppError } = require("../src/errors/AppError");
const router = express.Router();

const { v4: uuid } = require("uuid");

const Auth0Manager = require("../src/Auth0/Auth0");

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
    const Auth0 = new Auth0Manager();
    const auth0Response = await Auth0.FetchUserProfile(auth0ID);

    const identityObject = auth0Response.identities[0];

    const outUserObject = {
      spotifyUserID: identityObject.user_id,
      image: auth0Response.images[1],
      displayName: auth0Response.display_name,
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
