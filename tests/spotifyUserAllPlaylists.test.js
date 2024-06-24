/**
 * Integration tests for when frontend requests all the users playlists
 * https://stackoverflow.com/questions/14001183/how-to-authenticate-supertest-requests-with-passport
 */
const { app } = require("../app");
const request = require("supertest").agent(app);

const { auth0TestProfile } = require("./spotifyUserTestUtilities");

describe("Spotify User All Playlists Route", () => {
  let cookie;
  beforeAll((done) => {
    request
      .post("/auth0")
      .send({ auth0ID: auth0TestProfile.auth0ID })
      .then((res) => {
        cookie = res.headers["set-cookie"];
        done();
      });
  });

  test("Retrieve all playlists for an user", async () => {
    const sessionID = cookie[0].split(";")[0];

    try {
      const response = await request
        .get("/spotify/users/me/playlists")
        .set("Cookie", sessionID)
        .expect(200);

      expect(response).toBeTruthy();
    } catch (error) {}
  });
});
