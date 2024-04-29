const { playlistCreate, resetData, playlistGetByID } = require("../src/utils");

describe("Utility Function Unit Tests", () => {
  describe("Playlist create utility functions", () => {
    it("Should be able to create a playlist", () => {
      const response = playlistCreate("test playlist");
      expect(response).toEqual(
        expect.objectContaining({ id: expect.any(String) })
      );
    });
  });

  describe("Retrieving a playlist that was created", () => {
    let playlistID;
    beforeAll(() => {
      resetData();
      const { id } = playlistCreate("test playlist");
      playlistID = id;
    });

    describe("Should be able to retrieve created playlist", () => {
      it("Retrieving playlist", () => {
        const playlist = playlistGetByID(playlistID);
        expect(playlist).toStrictEqual(
          expect.objectContaining({ id: playlistID })
        );
      });
    });

    describe("Should be able to retrieve playlists songListObject", () => {});
  });
});
