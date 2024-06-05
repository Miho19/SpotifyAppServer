const { AppError } = require("../errors/AppError");
const Auth0Manager = require("./Auth0Manager");
const Auth0UserProfile = require("./Auth0UserProfile");
const { v4: uuid } = require("uuid");

async function auth0CreateNewUserObject(sessionID, auth0ID) {
  try {
    const auth0Manager = new Auth0Manager();
    await auth0Manager.initialise();
    const userProfileManager = new Auth0UserProfile(auth0Manager, auth0ID);
    const userProfile = await userProfileManager.FetchUserProfile();

    const userObject = {
      id: uuid(),
      sessionID,
      auth0ID,
      userProfile,
    };

    return userObject;
  } catch (err) {
    throw new AppError(500, "Error Fetching User Details");
  }
}

module.exports = { auth0CreateNewUserObject };
