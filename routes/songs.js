const express = require("express");
const router = express.Router({ mergeParams: true });
const { AppError } = require("../src/errors/AppError");

const {
  playlistGetByID,
  songListObjectGetByID,
  songObjectCheckFieldUpdates,
} = require("../src/utils");
let { playlists, songListIDArray } = require("../src/utils");

router.get("/", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const playlist = playlistGetByID(id);
  const songList = songListObjectGetByID(playlist.id);
  res.status(200).json([...songList.songArray]);
});

router.get("/:songID", (req, res) => {
  const { id, songID } = req.params;
  const playlist = playlistGetByID(id);
  const songList = songListObjectGetByID(playlist.id);
  const songListArray = songList.songArray;
  const song = songListArray.find((s) => s.id === songID);

  if (!song) throw new AppError(404, "Song ID not found");
  res.status(200).json({ ...song });
});

router.patch("/:songID", (req, res) => {
  const { id, songID } = req.params;
  const body = req.body;
  const playlist = playlistGetByID(id);
  const songList = songListObjectGetByID(playlist.id);
  const songListArray = songList.songArray;

  const updateFields = songObjectCheckFieldUpdates(body);

  let updatedSong;

  const updatedSongListArray = songListArray.map((song) => {
    if (song.id === songID) {
      updatedSong = { ...song, ...updateFields };
      return updatedSong;
    }
    return song;
  });

  if (!updatedSong) throw new AppError(404, "Song ID not found");
  songList.songArray = updatedSongListArray;

  res.status(200).json(updatedSong);
});

module.exports = router;
