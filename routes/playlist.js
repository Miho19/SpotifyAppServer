const express = require("express");
const router = express.Router();
const songsRouter = require("./songs");
const { playlistGetByID } = require("../src/utils");
let { playlists } = require("../src/utils");
const { v4: uuid } = require("uuid");

router.get("/", (req, res) => {
  res.status(200).json(playlists);
});

router.post("/", (req, res, next) => {
  const body = req.body;
  const newPlaylist = {
    ...body,
    id: uuid(),
    SpotifyplaylistID: uuid(),
  };
  playlists = [...playlists, newPlaylist];

  res.status(201).json(newPlaylist);
});

router.get("/:playlistID", (req, res) => {
  const { playlistID } = req.params;

  const playlist = playlistGetByID(playlistID);
  res.status(200).json(playlist);
});

router.use("/:playlistID/songs", songsRouter);

module.exports = router;
