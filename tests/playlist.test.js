const request = require("supertest");
const app = require("../app");

describe("Playlist Route Testing", () => {
  it("GET /playlists, returns all playlists", () => {
    return request(app)
      .get("/playlists")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              SpotifyplaylistID: expect.any(String),
            }),
          ])
        );
      });
  });
  it("POST /playlists, creating a new playlist should return that playlist", () => {
    return request(app)
      .post("/playlists")
      .send({ name: "new playlist" })
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "new playlist",
            SpotifyplaylistID: expect.any(String),
          })
        );
      });
  });

  it("GET /playlists/1, should return a playlist with that id", () => {
    return request(app)
      .get("/playlists/1")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({ id: "1" }));
      });
  });

  it("GET /playlists/123415, should not return a playlist and throw an error", () => {
    return request(app)
      .get("/playlists/123415")
      .expect("Content-Type", /json/)
      .expect(404);
  });

  it("GET /playlist/1/songs should return a playlist", () => {
    return request(app)
      .get("/playlists/1/songs")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              spotifyTrackID: expect.any(String),
              upvotes: expect.any(Number),
              downvotes: expect.any(Number),
              userID: expect.any(String),
            }),
          ])
        );
      });
  });

  it("GET /playlist/132131/songs, should return 404 error", () => {
    return request(app)
      .get("/playlist/132131/songs")
      .expect("Content-Type", /json/)
      .expect(404);
  });
  it("PATCH /playlists/1/songs/1, should increase the votes on a song", () => {
    return request(app)
      .patch("/playlists/1/songs/1")
      .send({ upvotes: 1 })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: "1",
            upvotes: 1,
            downvotes: 0,
            spotifyTrackID: expect.any(String),
            userID: expect.any(String),
          })
        );
      });
  });

  it("PATCH /playlists/1/songs/121312321, song should not be found and update should fail", () => {
    return request(app)
      .patch("/playlists/1/songs/121312321")
      .send({ upvotes: 1 })
      .expect(404)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            message: expect.any(String),
          })
        );
      });
  });
});
