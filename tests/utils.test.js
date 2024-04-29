const {
  playlistCreate,
  resetData,
  playlistGetByID,
  songListObjectGetByID,
  songListObjectAddSong,
  songObjectCheckFieldUpdates,
  songObjectInvalidUpdateFieldsArray,
} = require("../src/utils");

const { v4: uuid } = require("uuid");

describe("Utility Function Unit Tests", () => {
  let playlistID;
  const playlistName = "test playlist";

  describe("Playlist create utility functions", () => {
    it("Should be able to create a playlist", () => {
      const response = playlistCreate(playlistName);
      expect(response).toEqual(
        expect.objectContaining({ id: expect.any(String) })
      );
    });

    it("Can not playlist with the same name", () => {
      expect(() => {
        playlistCreate(playlistName);
      }).toThrow();
    });
  });

  describe("Retrieving a playlist that was created", () => {
    beforeAll(() => {
      resetData();
      const { id } = playlistCreate(playlistName);
      playlistID = id;
    });

    describe("Should be able to retrieve created playlist", () => {
      it("Retrieving playlist", () => {
        const playlist = playlistGetByID(playlistID);
        expect(playlist).toStrictEqual(
          expect.objectContaining({ id: playlistID })
        );
      });

      it("Retrieve invalid playlistID should throw", () => {
        expect(() => {
          playlistGetByID(uuid());
        }).toThrow();
      });
    });

    describe("Should be able to retrieve playlists songListObject", () => {
      it("Retrieving playlist songListObject", () => {
        const playlist = playlistGetByID(playlistID);
        const songListObject = songListObjectGetByID(playlist.songListObjectID);
        expect(songListObject).toEqual(expect.objectContaining({}));
      });

      it("Retrieving invalid songListObjectID should throw", () => {
        expect(() => {
          songListObjectGetByID(uuid());
        }).toThrow();
      });
    });

    describe("Should be able to add a song to the playlist", () => {
      let userID;
      let spotifyTrackID;

      beforeAll(() => {
        userID = uuid();
        spotifyTrackID = uuid();
      });

      it("Adding song to playlist", () => {
        const playlist = playlistGetByID(playlistID);

        const response = songListObjectAddSong(playlist.songListObjectID, {
          spotifyTrackID,
          userID,
        });
        expect(response).toEqual(
          expect.objectContaining({ userID, spotifyTrackID })
        );
      });

      it("Adding a song with the same ID should throw", () => {
        expect(() => {
          const playlist = playlistGetByID(playlistID);
          songListObjectAddSong(playlist.songListObjectID, {
            spotifyTrackID,
            userID,
          });
        }).toThrow();
      });
    });

    describe("Checking body for correct song properties", () => {
      it("A valid body should be returned when song is added", () => {
        const body = songObjectCheckFieldUpdates({ upvotes: 0, downvotes: 0 });
        expect(body).toEqual(
          expect.objectContaining({ upvotes: 0, downvotes: 0 })
        );
      });

      it("Invalid body fields should throw", () => {
        songObjectInvalidUpdateFieldsArray.forEach((field) => {
          expect(() => {
            songObjectCheckFieldUpdates({ [field]: uuid() });
          }).toThrow();
        });
      });
    });
  });
});
