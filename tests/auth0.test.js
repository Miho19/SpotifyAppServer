const Auth0Manager = require("../src/Auth0/Auth0Manager");
const Auth0UserProfile = require("../src/Auth0/Auth0UserProfile");

//const initialiseMock = jest.spyOn(Auth0Manager.prototype, "initialise");

const auth0TestProfile = {
  auth0ID: "oauth2|spotify|spotify:user:1253470477",
  testDisplayName: "Josh April",
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
});
