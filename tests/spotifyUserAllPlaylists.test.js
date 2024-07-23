/**
 * Integration tests for when frontend requests all the users playlists
 * https://stackoverflow.com/questions/14001183/how-to-authenticate-supertest-requests-with-passport
 */
const init = require("../app");
const supertest = require("supertest");

const { auth0TestProfile } = require("./spotifyUserTestUtilities");

describe("Spotify User All Playlists Route", () => {
  let app;
  let request;
  beforeAll(async () => {
    app = await init();
    request = supertest.agent(app);
  });

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
        .expect("Content-Type", /json/)
        .expect(200);

      const { body } = response;

      expect(body).toBeTruthy();
      expect(body).toEqual(
        expect.objectContaining({
          limit: expect.any(Number),
          offset: expect.any(Number),
          next: expect.anything(),
          previous: expect.anything(),
          total: expect.any(Number),
          items: expect.anything(),
        })
      );
    } catch (error) {}
  });
});
