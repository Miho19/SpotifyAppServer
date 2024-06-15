const { AppError } = require("../errors/AppError");

async function spotifyGetUserObject(auth0UserObject) {
  const { userProfile } = auth0UserObject;

  const auth0IdentityObject = userProfile.identities[0];

  const spotifyUserObject = {
    spotifyUserID: auth0IdentityObject.user_id,
    image: userProfile.images[1],
    displayName: userProfile.display_name,
  };

  return spotifyUserObject;
}

async function spotifyRetrieveUserObject(spotifyUserManager, queryUserID) {
  spotifyRetrieveUserObjectParameterValidation(spotifyUserManager, queryUserID);

  const options = spotifyAPIGenerateOptionsObject(spotifyUserManager, "GET");

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/${queryUserID}`,
      options
    );
  } catch (err) {
    console.log(err);
  }
}

function spotifyRetrieveUserObjectParameterValidation(
  spotifyUserManager,
  queryUserID
) {
  if (!spotifyUserManager || !spotifyUserManager.accessToken)
    throw new AppError(500, "Spotify User Manager Missing");

  if (!queryUserID) throw new AppError(500, "User ID Missing");
}

function spotifyAPIGenerateOptionsObject(spotifyUserManager, methodType) {
  return {
    method: methodType,
    headers: { Authorization: `Bearer ${spotifyUserManager.accessToken}` },
  };
}

module.exports = { spotifyGetUserObject, spotifyRetrieveUserObject };
