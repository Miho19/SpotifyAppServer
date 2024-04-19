const express = require("express");
const router = express.Router();

let playlists = [
  { id: 1, name: "first playlist", SpotifyplaylistID: "12345678910" },
];

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
  const playlist = playlists.find((p) => p.id === parseInt(id));
  if (!playlist) throw new Error("Not Found");
  res.status(200).json(playlist);
});

module.exports = router;
