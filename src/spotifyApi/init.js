const { AppError } = require("../errors/AppError");

let Auth0AccessToken;

const Auth0InitialiseManagementApiGetAccessToken = async () => {
  if (Auth0AccessToken) return;

  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: '{"client_id":"zyddk7473NMaY8Fa8GxeZfFgujuVNvNp","client_secret":"rfiBRHmRGm3jok11klxpxVqDJhkrJ3kx_ivwopzH5w_yWMvWycvKVJq8Mwkt5VnA","audience":"https://dev-t10i14pvkktezprz.us.auth0.com/api/v2/","grant_type":"client_credentials"}',
  };

  try {
    const response = await fetch(
      "https://dev-t10i14pvkktezprz.us.auth0.com/oauth/token",
      options
    );

    const body = await response.json();

    return body.access_token;
  } catch (errors) {
    throw new AppError(500, "Unable to initialise Auth0 Management System");
  }
};

const Auth0GetUserFullProfile = async (Auth0AccessToken) => {
  let options = {
    method: "GET",
    headers: { authorization: `Bearer ${Auth0AccessToken}` },
  };

  const response = await fetch(
    "https://dev-t10i14pvkktezprz.us.auth0.com/api/v2/users/oauth2|spotify|spotify:user:1253470477",
    options
  );

  const body = await response.json();
  return body;
};

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
