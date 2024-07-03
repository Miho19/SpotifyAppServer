const { AppError } = require("../errors/AppError");

// "oauth2|spotify|spotify:user:1253470477"

const spotifyTestRoute = async (SpotifyAccessToken) => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${SpotifyAccessToken}` },
  };

  const response = await fetch(
    "https://api.spotify.com/v1/me/playlists",
    options
  );
  return await response.json();
};

const spotifyApiInitialise = async () => {
  if (!Auth0AccessToken)
    Auth0AccessToken = await Auth0InitialiseManagementApiGetAccessToken();

  const Auth0UserProfile = await Auth0GetUserFullProfile(Auth0AccessToken);

  const response = await spotifyTestRoute(
    Auth0UserProfile.identities[0].access_token
  );
};

module.exports = { spotifyApiInitialise };
