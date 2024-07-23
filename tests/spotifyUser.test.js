const { auth0CreateNewUserObject } = require("../src/Auth0/Auth0Utility");
const { SpotifyUserManager } = require("../src/spotifyApi/SpotifyUserManager");
const {
  spotifyRetrieveUserObject,
  spotifyRetrieveAllUserPlaylists,
  spotifyRetrievePlaylist,
} = require("../src/spotifyApi/spotifyUtility");
const { AppError } = require("../src/errors/AppError");

const {
  spotifyUserObjectTest,
  auth0TestProfile,
} = require("./spotifyUserTestUtilities");

describe("Spotify Utility Tests", () => {
  let spotifyUserManager;

  beforeAll(async () => {
    spotifyUserManager = new SpotifyUserManager(spotifyUserObjectTest);
  });

  describe("Spotify User Manager", () => {
    test("Retrieve an access token", () => {
      expect(spotifyUserManager.accessToken).toBeTruthy();
    });

    test("Retrieve User ID", () => {
      expect(spotifyUserManager.userID).toBeTruthy();
    });
  });

  describe("Spotify API User Profile", () => {
    test("Spotify getting me user profile", async () => {
      const queryUserID = auth0TestProfile.spotifyUserID;

      const response = await spotifyRetrieveUserObject(
        spotifyUserManager,
        queryUserID
      );

      expect(response).toEqual(
        expect.objectContaining({
          spotifyUserID: expect.any(String),
          displayName: expect.any(String),
          image: expect.any(String),
        })
      );
    });

    test("Spotify getting invalid user profile, invalid query ID", async () => {
      const queryUserID = "";

      try {
        const response = await spotifyRetrieveUserObject(
          spotifyUserManager,
          queryUserID
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty("statusCode", 500);
        expect(error).toHaveProperty("message", "Query ID Missing");
      }
    });

    test("Spotify getting invalid user profile, invalid spotify user manager", async () => {
      const queryUserID = "me";
      try {
        const response = await spotifyRetrieveUserObject(null, queryUserID);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty("statusCode", 500);
        expect(error).toHaveProperty("message", "Spotify User Manager Missing");
      }
    });
  });

  describe("Spotify API User All Playlists", () => {
    test("Retrieve current user playlists", async () => {
      const queryUserID = auth0TestProfile.spotifyUserID;

      const response = await spotifyRetrieveAllUserPlaylists(
        spotifyUserManager,
        queryUserID
      );
      expect(response).toBeTruthy();

      expect(response).toEqual(
        expect.objectContaining({
          limit: expect.any(Number),
          offset: expect.any(Number),
          next: expect.any(String),
          previous: expect.any(String),
          total: expect.any(Number),
          items: expect.anything(),
        })
      );
    });
  });

  describe("Spotify API Playlist", () => {
    test("Retrieving a valid playlist", async () => {
      const { id: playlistID } = auth0TestProfile.playlist;
      const response = await spotifyRetrievePlaylist(
        spotifyUserManager,
        playlistID
      );

      expect(response).toBeTruthy();
    });

    test("Retrieving an invalid playlist", async () => {
      const playlistID = "1231";

      try {
        const response = await spotifyRetrievePlaylist(
          spotifyUserManager,
          playlistID
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty("statusCode", 400);
        expect(error).toHaveProperty(
          "message",
          `Failed to retrieve playlist: ${playlistID}`
        );
      }
    });
  });
});
