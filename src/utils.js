const { AppError } = require("../src/errors/AppError");

let playlists = [
  {
    id: "1",
    name: "first playlist",
    SpotifyplaylistID: "12345678910",
    songListID: "1",
  },
];

let songListIDArray = [
  {
    id: "1",
    songArray: [
      { id: "1", spotifyTrackID: "", upvotes: 0, downvotes: 0, userID: "" },
    ],
  },
];

const playlistGetByID = (id) => {
  const playlist = playlists.find((p) => p.id === id);
  if (!playlist) throw new AppError(404, "Playlist not found");
  return playlist;
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

module.exports = {
  playlistGetByID,
  songListObjectGetByID,
  songObjectCheckFieldUpdates,
  playlists,
  songListIDArray,
};
