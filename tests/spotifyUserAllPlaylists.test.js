/**
 * Integration tests for when frontend requests all the users playlists
 * https://stackoverflow.com/questions/14001183/how-to-authenticate-supertest-requests-with-passport
 */
const init = require("../app");
const supertest = require("supertest");

const { auth0TestProfile } = require("./spotifyUserTestUtilities");
const {
  spotifyClientCredentialsGrant,
} = require("../src/spotifyApi/spotifyUtility");
const MysqlLocalHost = require("../src/database/mysqlLocalHost");

describe("Spotify User All Playlists Route", () => {
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
