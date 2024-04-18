const request = require("supertest");
const app = require("../app");

describe("Playlist API", () => {
  it("GET /playlist, returns playlist", () => {
    return request(app)
      .get("/playlist")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: expect.any(String) }),
          ])
        );
      });
  });

  it("GET /playlist/:index, returns a specific song from that playlist", () => {
    return request(app)
      .get("/playlist/1")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({ name: expect.any(String) })
        );
      });
  });

  it("GET /playlist/:index, 404 if not found", () => {
    return request(app)
      .get("/playlist/9999999")
      .expect("Content-Type", /json/)
      .expect(404);
  });

  it("PATCH /playlist, adding a song to the playlist", () => {
    return request(app)
      .patch("/playlist")
      .send({ name: "new song" })
      .expect("Content-Type", /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual(expect.objectContaining({ name: "new song" }));
      });
  });

  it("GET /playlist", () => {
    return request(app).patch("/playlist").send({ name: 123 }).expect(422);
  });
});

/***
 * want to get the main playlist that has songs/votes
 * want user to get their votes/profile information
 * update users profile
 * add song to playlist, update songs votes
 * validate request body of playlist
 *  */
