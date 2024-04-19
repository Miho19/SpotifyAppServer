const express = require("express");
const { AppError } = require("../src/errors/AppError");
const router = express.Router();

let playlists = [
  { id: 1, name: "first playlist", SpotifyplaylistID: "12345678910" },
];

const playlistGetByID = (id) => {
  const playlist = playlists.find((p) => p.id === parseInt(id));
  if (!playlist) throw new AppError(404, "Playlist not found");
  return playlist;
};

router.get("/", (req, res) => {
  res.status(201).json(playlists);
});

router.post("/", (req, res, next) => {
  const body = req.body;
  const newPlaylist = {
    ...body,
    id: playlists.length + 1,
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

module.exports = router;
