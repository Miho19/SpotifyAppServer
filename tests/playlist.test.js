const request = require("supertest");
const app = require("../app");
const { playlistCreate } = require("../src/utils");

describe("Playlist Route Testing", () => {
  describe("Retrieving playlist data from the API", () => {
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

    it("GET /playlists/123415, should not return a playlist and throw an error", () => {
      return request(app)
        .get("/playlists/123415")
        .expect("Content-Type", /json/)
        .expect(404);
    });

    it("GET /playlist/1/songs, should return 404 error", () => {
      return request(app)
        .get("/playlist/132131/songs")
        .expect("Content-Type", /json/)
        .expect(404);
    });

    it("PATCH /playlists/1/songs/1, song should not be found and update should fail", () => {
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

  describe("Creating new playlists", () => {
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
  });

  describe("Manipulating a newly created playlist", () => {
    let id;
    beforeAll(() => {
      const { id: returnedID } = playlistCreate("test playlist");
      id = returnedID;
    });

    it(`GET /playlist/${id} should return a newly created playlist`, () => {
      return request(app)
        .get(`/playlists/${id}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(expect.objectContaining({ id }));
        });
    });

    it(`GET /playlist/${id}/songs should return a list of songs`, () => {
      return request(app)
        .get(`/playlists/${id}/songs`)
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
            id: expect.any(String),
            upvotes: 1,
            downvotes: 0,
            spotifyTrackID: expect.any(String),
            userID: expect.any(String),
          })
        );
      });
  });

  it("GET /playlists/1/songs/1, should return a song", () => {
    return request(app)
      .get("/playlists/1/songs/1")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            spotifyTrackID: expect.any(String),
            upvotes: expect.any(Number),
            downvotes: expect.any(Number),
            userID: expect.any(String),
          })
        );
      });
  });
});
