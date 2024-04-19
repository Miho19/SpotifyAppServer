const request = require("supertest");
const app = require("../app");

describe("Playlist Route Testing", () => {
  it("GET /playlists, returns all playlists", () => {
    return request(app)
      .get("/playlists")
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
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
            id: expect.any(Number),
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
        expect(response.body).toEqual(expect.objectContaining({ id: 1 }));
      });
  });

  it("GET /playlists/123415, should not return a playlist and throw an error", () => {
    return request(app)
      .get("/playlists/123415")
      .expect("Content-Type", /json/)
      .expect(404);
  });
});
