/**
 * Integration tests for when frontend requests an users playlist
 *
 */
const init = require("../app");
const supertest = require("supertest");

const { auth0TestProfile } = require("./spotifyUserTestUtilities");
const MysqlLocalHost = require("../src/database/mysqlLocalHost");
const {
  spotifyClientCredentialsGrant,
} = require("../src/spotifyApi/spotifyUtility");

describe("Spotify User Playlist Route", () => {
  let cookie;
  let app;
  let request;
  let sessionID;
  let mysqlLocalHost;

  beforeAll(async () => {
    app = await init();
    request = supertest.agent(app);

    const response = await request
      .post("/auth0")
      .send({ auth0ID: auth0TestProfile.auth0ID });

    cookie = response.headers["set-cookie"];
    sessionID = cookie[0].split(";")[0];
    // need to edit the database value access Token

    const accessToken = await spotifyClientCredentialsGrant();
    mysqlLocalHost = new MysqlLocalHost();

    await mysqlLocalHost.connection.query(
      "UPDATE users SET u_accessToken=? WHERE u_displayName=?",
      [accessToken, "Josh April"]
    );

    await mysqlLocalHost.connection.query("SELECT * FROM users");
  });

  afterAll(async () => {
    await mysqlLocalHost.usersRemoveAll();
  });

  test("Retrieve a playlist from an user", async () => {
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
