/**
 * Integration tests for when frontend requests an users playlist
 *
 */
const init = require("../app");
const supertest = require("supertest");

const { auth0TestProfile } = require("./spotifyUserTestUtilities");

describe("Spotify User Playlist Route", () => {
  let cookie;

  let app;
  let request;

  beforeAll(async () => {
    app = await init();
    request = supertest.agent(app);
  });

  beforeAll((done) => {
    request
      .post("/auth0")
      .send({ auth0ID: auth0TestProfile.auth0ID })
      .then((res) => {
        cookie = res.headers["set-cookie"];
        done();
      });
  });

  test("Retrieve a playlist from an user", async () => {
    const sessionID = cookie[0].split(";")[0];

    try {
      const response = await request
        .get(`/spotify/users/me/playlists/${auth0TestProfile.playlist.id}`)
        .set("Cookie", sessionID)
        .expect("Content-Type", /json/)
        .expect(200);

      const { body } = response;

      expect(body).toBeTruthy();
      expect(body).toEqual(
        expect.objectContaining({
          name: auth0TestProfile.playlist.name,
          owner: "Josh April",
          type: "playlist",
          link: expect.any(String),
          image: expect.any(String),
          tracks: expect.anything(),
        })
      );
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
