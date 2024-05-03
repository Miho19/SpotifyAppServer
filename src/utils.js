const { AppError } = require("../src/errors/AppError");
const { v4: uuid } = require("uuid");

let playlists = [
  {
    id: "-1",
    name: "first playlist",
    SpotifyplaylistID: "12345678910",
    songListObjectID: "-1",
  },
];

let songListIDArray = [
  {
    id: "-1",
    songArray: [
      {
        id: "-1",
        spotifyTrackID: "",
        upvotes: 0,
        downvotes: 0,
        userID: "",
      },
    ],
  },
];

let users = [
  {
    id: "-1",
    spotifyUserID: "12345",
    sessionID: "",
    auth0ID: "",
    spotifyUserObject: {},
  },
];

const songListObjectAddSong = (
  songListObjectID,
  { spotifyTrackID, userID }
) => {
  const songListObject = songListObjectGetByID(songListObjectID);

  const songArray = songListObject.songArray;

  if (songArray.some((song) => song.spotifyTrackID === spotifyTrackID))
    throw new AppError(400, "Songs must be unique");

  const newSongObject = {
    id: uuid(),
    upvotes: 0,
    downvotes: 0,
    spotifyTrackID,
    userID,
  };

  songListObject.songArray = [...songArray, newSongObject];
  return newSongObject;
};

const playlistGetByID = (playlistID) => {
  const playlist = playlists.find((p) => p.id === playlistID);
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
    songListObjectID: songListObjectCreate(),
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

const songListObjectGetByID = (songListObjectID) => {
  const songListObject = songListIDArray.find((s) => s.id === songListObjectID);
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

const usersAdd = (body) => {
  const { spotifyUserID } = body;

  if (!spotifyUserID) throw new AppError(400, "Must supply spotify user ID");

  if (users.some((user) => user.spotifyUserID === spotifyUserID))
    throw new AppError(400, "That user already exists");

  const newUser = { id: uuid(), spotifyUserID };

  users = [...users, newUser];

  return newUser;
};

const usersGet = (userID) => {
  const user = users.find((u) => u.id === userID);
  if (!user) throw new AppError(404, "User not found");
  return user;
};

const resetData = () => {
  playlists = [
    {
      id: "-1",
      name: "first playlist",
      SpotifyplaylistID: "12345678910",
      songListObjectID: "-1",
    },
  ];

  songListIDArray = [
    {
      id: "-1",
      songArray: [
        {
          id: "-1",
          spotifyTrackID: "",
          upvotes: 0,
          downvotes: 0,
          userID: "",
        },
      ],
    },
  ];
};

const UserGetBySessionID = (sessionID) => {
  const userObject = users.find((user) => user.sessionID === sessionID);
  return userObject;
};

module.exports = {
  usersAdd,
  playlistGetByID,
  songListObjectGetByID,
  songObjectCheckFieldUpdates,
  playlistCreate,
  songListObjectAddSong,
  resetData,
  usersGet,
  UserGetBySessionID,
  songObjectInvalidUpdateFieldsArray,
  playlists,
  songListIDArray,
  users,
};
