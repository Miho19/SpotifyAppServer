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

  it("GET /playlists/:id, should return a playlist with that id", () => {});
});
