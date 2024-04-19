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
              playlistID: expect.any(String),
            }),
          ])
        );
      });
  });
});
