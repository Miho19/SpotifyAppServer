const express = require("express");
const { AppError } = require("../src/errors/AppError");
const router = express.Router();

const { auth0CreateNewUserObject } = require("../src/Auth0/Auth0Utility");
const {
  routerUtilityRetrieveUserObject,
  routerUtilityRetrieveUserObjectRemoveAccessTokenCode,
  routerUtilityAddUser,
} = require("./routerUtility");

router.post("/", async (req, res, next) => {
  try {
    const userObject = await routerUtilityRetrieveUserObject(req.session);

    if (userObject) {
      const spotifyUserObject =
        routerUtilityRetrieveUserObjectRemoveAccessTokenCode(userObject);
      return res.status(200).json({ ...spotifyUserObject });
    }

    const { auth0ID } = req.body;
    const { id: sessionID } = req.session;

    if (!auth0ID) throw new AppError(400, "Missing Auth0 User ID");

    const newAuth0UserObject = await auth0CreateNewUserObject(
      sessionID,
      auth0ID
    );

    const spotifyUserObject = await routerUtilityAddUser(newAuth0UserObject);

    res.status(200).json({ ...spotifyUserObject });
  } catch (error) {
    if (error instanceof AppError) next(error);
  }
});

module.exports = router;
