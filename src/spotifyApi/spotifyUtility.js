const { AppError } = require("../errors/AppError");

const spotifyAPIConstants = {
  baseURL: "https://api.spotify.com/v1",
};

async function fetchRequest(fetchURL, options) {
  try {
    const response = await fetch(fetchURL, options);
    const body = await response.json();
    return body;
  } catch (err) {
    throw new AppError(400, "Fetch request failed");
  }
}

async function auth0UserObjectConvertToSpotifyUserObject(auth0UserObject) {
  const { userProfile } = auth0UserObject;

  const auth0IdentityObject = userProfile.identities[0];

  const spotifyUserObject = {
    spotifyUserID: auth0IdentityObject.user_id,
    image: userProfile.images[1],
    displayName: userProfile.display_name,
  };

  return spotifyUserObject;
}

async function spotifyAPIFetchRequest(
  spotifyUserManager,
  fetchURL,
  method,
  body
) {
  const options = spotifyAPIGenerateOptionsObject(
    spotifyUserManager,
    method,
    body
  );
  return await fetchRequest(fetchURL, options);
}

async function spotifyRetrieveUserObject(spotifyUserManager, queryUserID) {
  spotifyRetrieveUserObjectParameterValidation(spotifyUserManager, queryUserID);

  const fetchURL = `${spotifyAPIConstants.baseURL}/users/${queryUserID}`;

  const spotifyResponse = await spotifyAPIFetchRequest(
    spotifyUserManager,
    fetchURL,
    "GET",
    null
  );

  if (spotifyResponse.error)
    throw new AppError(
      400,
      `Could not retrieve user: ${queryUserID} from Spotify API`
    );

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

function spotifyRetrieveUserObjectParameterValidation(
  spotifyUserManager,
  queryID
) {
  if (!spotifyUserManager || !spotifyUserManager.accessToken)
    throw new AppError(500, "Spotify User Manager Missing");

  if (!queryID) throw new AppError(500, "Query ID Missing");
}

function spotifyAPIGenerateOptionsObject(
  spotifyUserManager,
  methodType,
  body = {}
) {
  return {
    method: methodType,
    headers: {
      Authorization: `Bearer ${spotifyUserManager.accessToken}`,
      "content-type": "application/json",
    },
    ...(body && body),
  };
}

async function spotifyRetrieveAllUserPlaylists(
  spotifyUserManager,
  queryUserID
) {
  spotifyRetrieveUserObjectParameterValidation(spotifyUserManager, queryUserID);

  const fetchURL = `${spotifyAPIConstants.baseURL}/users/${queryUserID}/playlists`;

  const spotifyResponse = await spotifyAPIFetchRequest(
    spotifyUserManager,
    fetchURL,
    "GET",
    null
  );

  if (spotifyResponse.error)
    throw new AppError(
      400,
      "Failed to retrieve all user playlists from Spotify API"
    );

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

  const spotifyResponse = await spotifyAPIFetchRequest(
    spotifyUserManager,
    href,
    "GET"
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

function spotifyPlaylistObjectConvertToServerPlaylistObject(playlistObject) {
  return {
    name: playlistObject.name,
    owner: playlistObject.owner.display_name,
    type: playlistObject.type,
    link: playlistObject.external_urls.spotify,
    image: playlistObject.images[0].url,
    tracks: playlistObject.tracks,
  };
}

async function spotifyCreateUserPlaylistsObjectPopulatePlaylistsWithtracks(
  spotifyUserManager,
  playlists
) {
  return await Promise.all(
    playlists.map(async (playlist) => {
      let tracks;
      try {
        tracks = await spotifyCreateUserPlaylistObjectFetchPlaylistTracks(
          spotifyUserManager,
          playlist.tracks
        );
      } catch (err) {
        throw new AppError(400, "Failed to retrieve playlist tracks");
      }

      return spotifyPlaylistObjectConvertToServerPlaylistObject({
        ...playlist,
        tracks,
      });
    })
  );
}

async function spotifyCreateUserPlaylistsObject(
  spotifyUserManager,
  spotifyResponse
) {
  let { limit, offset, next, previous, total, items } = spotifyResponse;

  const tracksPopulatedPlaylists =
    await spotifyCreateUserPlaylistsObjectPopulatePlaylistsWithtracks(
      spotifyUserManager,
      items
    );

  const userPlaylistObject = {
    limit,
    offset,
    next: next || "",
    previous: previous || "",
    total,
    items: tracksPopulatedPlaylists,
  };

  return userPlaylistObject;
}

async function spotifyRetrievePlaylist(spotifyUserManager, playlistID) {
  spotifyRetrieveUserObjectParameterValidation(spotifyUserManager, playlistID);

  const fetchURL = `${spotifyAPIConstants.baseURL}/playlists/${playlistID}`;

  const spotifyResponse = await spotifyAPIFetchRequest(
    spotifyUserManager,
    fetchURL,
    "GET",
    null
  );

  if (spotifyResponse.error)
    throw new AppError(400, `Failed to retrieve playlist: ${playlistID}`);

  return spotifyPlaylistObjectConvertToServerPlaylistObject(spotifyResponse);
}

module.exports = {
  auth0UserObjectConvertToSpotifyUserObject,
  spotifyRetrieveUserObject,
  spotifyRetrieveAllUserPlaylists,
  spotifyRetrievePlaylist,
};
