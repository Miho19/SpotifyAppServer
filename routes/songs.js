const express = require("express");
const router = express.Router({ mergeParams: true });
const { AppError } = require("../src/errors/AppError");
const { songListObjectAddSong } = require("../src/utils");

const {
  playlistGetByID,
  songListObjectGetByID,
  songObjectCheckFieldUpdates,
} = require("../src/utils");

router.get("/", (req, res) => {
  const { playlistID } = req.params;
  const playlist = playlistGetByID(playlistID);
  const songListObject = songListObjectGetByID(playlist.songListObjectID);
  res.status(200).json([...songListObject.songArray]);
});

router.post("/", (req, res) => {
  const { playlistID } = req.params;
  const { spotifyTrackID, userID } = req.body;
  const playlist = playlistGetByID(playlistID);

  const newSong = songListObjectAddSong(playlist.songListObjectID, {
    spotifyTrackID,
    userID,
  });

  res.status(201).json({ ...newSong });
});

router.get("/:songID", (req, res) => {
  const { playlistID, songID } = req.params;
  const playlist = playlistGetByID(playlistID);
  const songList = songListObjectGetByID(playlist.id);
  const songListArray = songList.songArray;
  const song = songListArray.find((s) => s.id === songID);

  if (!song) throw new AppError(404, "Song ID not found");
  res.status(200).json({ ...song });
});

router.patch("/:songID", (req, res) => {
  const { playlistID, songID } = req.params;
  const body = req.body;
  const playlist = playlistGetByID(playlistID);
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
