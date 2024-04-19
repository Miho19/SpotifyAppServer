const express = require("express");
const { AppError } = require("../src/errors/AppError");
const router = express.Router();

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
      { id: "1", spotifyTrackID: "", upVotes: 0, downVotes: 0, userID: "" },
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

router.get("/", (req, res) => {
  res.status(200).json(playlists);
});

router.post("/", (req, res, next) => {
  const body = req.body;
  const newPlaylist = {
    ...body,
    id: String(playlists.length + 1),
    SpotifyplaylistID: "dfklmsfkms",
  };
  playlists = [...playlists, newPlaylist];

  res.status(201).json(newPlaylist);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const playlist = playlistGetByID(id);
  res.status(200).json(playlist);
});

router.get("/:id/songs", (req, res) => {
  const { id } = req.params;
  const playlist = playlistGetByID(id);
  const songList = songListObjectGetByID(playlist.id);
  res.status(200).json([...songList.songArray]);
});

module.exports = router;
