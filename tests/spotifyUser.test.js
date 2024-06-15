const request = require("supertest");
const Auth0Manager = require("../src/Auth0/Auth0Manager");
const { auth0CreateNewUserObject } = require("../src/Auth0/Auth0Utility");
const { SpotifyUserManager } = require("../src/spotifyApi/SpotifyUserManager");
const {
  spotifyRetrieveUserObject,
} = require("../src/spotifyApi/spotifyUtility");
const { AppError } = require("../src/errors/AppError");

const auth0TestProfile = {
  auth0ID: "oauth2|spotify|spotify:user:1253470477",
  testDisplayName: "Josh April",
};

describe("Spotify Utility Tests", () => {
  let spotifyUserManager;

  beforeAll(async () => {
    const auth0UserObject = await auth0CreateNewUserObject(
      1,
      auth0TestProfile.auth0ID
    );
    spotifyUserManager = new SpotifyUserManager(auth0UserObject);
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
    test.skip("Spotify getting me user profile", () => {
      const queryUserID = "me";
      const response = spotifyRetrieveUserObject(
        spotifyUserManager,
        queryUserID
      );

      expect(response).toBe(
        expect.objectContaining({
          spotifyUserID: expect.any(String),
          displayName: expect.any(String),
          image: expect.any(String),
        })
      );
    });
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
      expect(error).toHaveProperty("message", "User ID Missing");
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
