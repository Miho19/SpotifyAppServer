const { AppError } = require("../errors/AppError");

async function fetchRequest(fetchURL, options) {
  try {
    const response = await fetch(fetchURL, options);
    const body = await response.json();
    return body;
  } catch (err) {
    throw new AppError(400, "Fetch request failed");
  }
}

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
  const spotifyResponse = await spotifyUserProfileGET(
    spotifyUserManager,
    queryUserID
  );

  if (spotifyResponse.error)
    throw new AppError(400, "Bad Request for Spotify api");

  return spotifyCreateUserObject(spotifyResponse);
}

function spotifyCreateUserObject(spotifyResponse) {
  const { display_name: displayName, images, id } = spotifyResponse;
  return {
    displayName,
    image: images[0].url,
    spotifyUserID: id,
  };
}

async function spotifyUserProfileGET(spotifyUserManager, queryUserID) {
  const options = spotifyAPIGenerateOptionsObject(spotifyUserManager, "GET");
  const fetchURL = `https://api.spotify.com/v1/users/${queryUserID}`;

  return await fetchRequest(fetchURL, options);
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
    headers: {
      Authorization: `Bearer ${spotifyUserManager.accessToken}`,
      "content-type": "application/json",
    },
  };
}

async function spotifyRetrieveAllUserPlaylists(
  spotifyUserManager,
  queryUserID
) {
  spotifyRetrieveUserObjectParameterValidation(spotifyUserManager, queryUserID);
  const spotifyResponse = await spotifyUserPlaylistsGET(
    spotifyUserManager,
    queryUserID
  );

  if (spotifyResponse.error)
    throw new AppError(400, "Bad Request for Spotify api");

  return await spotifyCreateUserPlaylistsObject(
    spotifyUserManager,
    spotifyResponse
  );
}

async function spotifyCreateUserPlaylistObjectFetchPlaylistTracks(
  spotifyUserManager,
  trackObject
) {
  const { href } = trackObject;
  if (!href) return {};

  const spotifyResponse = await spotifyPlaylistTracksGet(
    spotifyUserManager,
    href
  );

  if (spotifyResponse.error)
    throw new AppError(400, "Failed to retrieve playlist tracks");

  const { items } = spotifyResponse;

  const tracks = items.map((item) => {
    const { track } = item;

    return {
      id: track?.id,
      album: {
        id: track.album?.id,
        image: track.album?.images[0].url,
        name: track.ablum?.name,
      },
      name: track?.name,
      popularity: track?.popularity,
      durationMS: track?.duration_ms,
    };
  });

  return tracks;
}

async function spotifyCreateUserPlaylistsObject(
  spotifyUserManager,
  spotifyResponse
) {
  let {
    limit,
    offset,
    next,
    previous,
    total,
    items: returnedPlaylists,
  } = spotifyResponse;

  returnedPlaylists = [returnedPlaylists[0]];

  const items = await Promise.all(
    returnedPlaylists.map(async (playlist) => {
      let tracks;
      try {
        tracks = await spotifyCreateUserPlaylistObjectFetchPlaylistTracks(
          spotifyUserManager,
          playlist.tracks
        );
      } catch (err) {
        console.log(err);
        throw new AppError(400, "Failed to retrieve playlist tracks");
      }

      return {
        name: playlist.name,
        owner: playlist.owner.display_name,
        type: playlist.type,
        link: playlist.external_urls.spotify,
        image: playlist.images[0].url,
        tracks,
      };
    })
  );

  const userPlaylistObject = {
    limit,
    offset,
    next: "",
    previous: "",
    total,
    items,
  };

  return userPlaylistObject;
}

async function spotifyUserPlaylistsGET(spotifyUserManager, queryUserID) {
  const options = spotifyAPIGenerateOptionsObject(spotifyUserManager, "GET");
  const fetchURL = `https://api.spotify.com/v1/users/${queryUserID}/playlists`;

  return await fetchRequest(fetchURL, options);
}

async function spotifyPlaylistTracksGet(spotifyUserManager, playlistTracksURL) {
  const options = spotifyAPIGenerateOptionsObject(spotifyUserManager, "GET");
  return await fetchRequest(playlistTracksURL, options);
}

module.exports = {
  spotifyGetUserObject,
  spotifyRetrieveUserObject,
  spotifyRetrieveAllUserPlaylists,
};
