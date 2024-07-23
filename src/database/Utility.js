function UsersDatabaseCreateUserObject(auth0UserObject) {
  const auth0UserProfile = auth0UserObject.userProfile;

  const { display_name: displayName } = auth0UserProfile;

  const { access_token: accessToken, user_id: userID } =
    auth0UserProfile.identities[0];

  const imageURL = auth0UserProfile.images[0].url;

  return {
    displayName,
    accessToken,
    imageURL,
    userID,
  };
}

function UsersDatabaseConvertObjectToServerObject(user) {
  return {
    accessToken: user.u_accessToken,
    spotifyID: user.u_spotifyID,
    displayName: user.u_displayName,
    image: user.u_imageURL,
  };
}

module.exports = {
  UsersDatabaseCreateUserObject,
  UsersDatabaseConvertObjectToServerObject,
};
