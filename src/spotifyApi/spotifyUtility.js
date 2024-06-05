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

module.exports = { spotifyGetUserObject };
