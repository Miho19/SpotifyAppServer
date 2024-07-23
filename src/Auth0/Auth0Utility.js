const Auth0Manager = require("./Auth0Manager");
const Auth0UserProfile = require("./Auth0UserProfile");

async function auth0CreateNewUserObject(sessionID, auth0ID) {
  const auth0Manager = new Auth0Manager();
  await auth0Manager.initialise();

  const userProfileManager = new Auth0UserProfile(auth0Manager, auth0ID);

  const userProfile = await userProfileManager.FetchUserProfile();

  const userObject = {
    sessionID,
    auth0ID,
    userProfile,
  };

  return userObject;
}

module.exports = { auth0CreateNewUserObject };
