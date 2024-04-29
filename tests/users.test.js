const request = require("supertest");
const app = require("../app");

const { v4: uuid } = require("uuid");
const { usersAdd } = require("../src/utils");

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

  describe("Create a new user and get that user", () => {
    let userID;
    beforeAll(() => {
      const response = usersAdd({ spotifyUserID: uuid() });
      const { id: responseID } = response;
      userID = responseID;
    });

    it("Retrieve a user by their ID", () => {
      return request(app)
        .get(`/users/${userID}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: userID,
              spotifyUserID: expect.any(String),
            })
          );
        });
    });
  });
});
