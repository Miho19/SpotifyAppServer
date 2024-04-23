const { AppError } = require("../src/errors/AppError");
const { v4: uuid } = require("uuid");

let playlists = [
  {
    id: "-1",
    name: "first playlist",
    SpotifyplaylistID: "12345678910",
    songListID: "-1",
  },
];

let songListIDArray = [
  {
    id: "-1",
    songArray: [
      { id: "-1", spotifyTrackID: "", upvotes: 0, downvotes: 0, userID: "" },
    ],
  },
];

const playlistGetByID = (id) => {
  const playlist = playlists.find((p) => p.id === id);
  if (!playlist) throw new AppError(404, "Playlist not found");
  return playlist;
};

const playlistCreate = (playlistName) => {
  playlistName = playlistName.trim();
  if (!playlistName) throw new AppError(400, "Must supply a playlist name");
  if (playlists.some((playlist) => playlist.name === playlistName))
    throw new AppError(400, "Playlist names must be unique");

  const createdPlaylist = {
    name: playlistName,
    id: uuid(),
    SpotifyplaylistID: spotifyPlaylistCreate(playlistName),
    songListID: songListObjectCreate(),
  };

  playlists = [...playlists, createdPlaylist];
  return createdPlaylist;
};

const songListObjectCreate = () => {
  const id = uuid();

  songListIDArray = [...songListIDArray, { id, songArray: [] }];

  return id;
};

const spotifyPlaylistCreate = (playlistName) => {
  return uuid();
};

const songListObjectGetByID = (id) => {
  const songListObject = songListIDArray.find((s) => s.id === id);
  if (!songListObject) throw new AppError(404, "Song list not found");
  return songListObject;
};

const songObjectInvalidUpdateFieldsArray = ["id", "spotifyTrackID", "userID"];

const songObjectCheckFieldUpdates = (body) => {
  const bodyKeys = Object.keys(body);
  const result = bodyKeys.some((key) =>
    songObjectInvalidUpdateFieldsArray.includes(key)
  );
  if (result)
    throw new AppError(
      400,
      `You can not update the following fields, ${songObjectInvalidUpdateFieldsArray.join(
        ","
      )}`
    );

  return body;
};

let users = [{ id: uuid(), spotifyUserID: "1234567" }];

const usersAdd = (body) => {
  const { spotifyUserID } = body;

  if (users.some((user) => user.spotifyUserID === spotifyUserID))
    throw new AppError(400, "That user already exists");
};

module.exports = {
  usersAdd,
  playlistGetByID,
  songListObjectGetByID,
  songObjectCheckFieldUpdates,
  playlistCreate,
  playlists,
  songListIDArray,
};
