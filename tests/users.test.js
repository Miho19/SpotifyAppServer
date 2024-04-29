const request = require("supertest");
const app = require("../app");

const { v4: uuid } = require("uuid");

describe("Testing the user routes", () => {
  describe("Retrieving users list", () => {
    it("GET /users, return all users within the system", () => {
      return request(app)
        .get("/users")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((response) => {
          expect(response.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                spotifyUserID: expect.any(String),
              }),
            ])
          );
        });
    });

    describe("Creating new users", () => {
      it("POST /users, should create a new users and return the new user", () => {
        const spotifyUserID = uuid();
        return request(app)
          .post("/users")
          .send({ spotifyUserID })
          .expect(201)
          .expect("Content-Type", /json/)
          .then((response) => {
            expect(response.body).toEqual(
              expect.objectContaining({ id: expect.any(String), spotifyUserID })
            );
          });
      });
      it("POST /users, with no spotify id should throw", () => {
        return request(app).post("/users").send({}).expect(400);
      });
    });
  });
});
