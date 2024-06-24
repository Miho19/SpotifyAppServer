const Auth0Manager = require("../src/Auth0/Auth0Manager");
const Auth0UserProfile = require("../src/Auth0/Auth0UserProfile");
const request = require("supertest");
const { app } = require("../app");
const { v4: uuid } = require("uuid");

const { auth0TestProfile } = require("./spotifyUserTestUtilities");

const existingTestProfile = {
  id: uuid(),
  sessionID: uuid(),
  auth0ID: uuid(),
  privateUserObject: {},
  publicUserObject: {},
};

describe("Auth0", () => {
  describe("Auth0Manager Class", () => {
    let auth0;

    beforeEach(() => {
      auth0 = new Auth0Manager();
    });

    test("Initialising Auth0Manager should set the access token", async () => {
      await auth0.initialise();
      expect(auth0.auth0AccessToken).toBeTruthy();
    });

    test("Manager is a singleton", () => {
      const auth01 = new Auth0Manager();
      expect(auth01 === auth0);
    });
  });

  describe("Auth0UserProfile Class", () => {
    let auth0;

    beforeEach(() => {
      auth0 = new Auth0Manager();
    });

    test("Fetching user Auth0 profile", async () => {
      const userProfileManager = new Auth0UserProfile(
        auth0,
        auth0TestProfile.auth0ID
      );
      const userProfile = await userProfileManager.FetchUserProfile();
      expect(userProfile).toBeTruthy();
      expect(userProfile.display_name === auth0TestProfile.testDisplayName);
    });
  });

  describe("Auth0 Route", () => {
    describe("Creating a user", () => {
      test("POST /auth0 should create a new user and return display profile", () => {
        return request(app)
          .post("/auth0")
          .send({ auth0ID: auth0TestProfile.auth0ID })
          .expect(200)
          .expect("Content-Type", /json/)
          .then((response) => {
            const body = response.body;
            expect(body).toEqual(
              expect.objectContaining({
                spotifyUserID: expect.any(String),
                image: expect.any(Object),
                displayName: expect.any(String),
              })
            );
          });
      });
    });

    describe("Retrieving already created user", () => {
      beforeAll(async () => {
        await request(app)
          .post("/auth0")
          .send({ auth0ID: auth0TestProfile.auth0ID });
      });

      beforeEach(() => jest.restoreAllMocks());

      test("Auth0UserProfile fetchUserProfile should not be called", async () => {
        const spy = jest.spyOn(Auth0UserProfile.prototype, "FetchUserProfile");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
