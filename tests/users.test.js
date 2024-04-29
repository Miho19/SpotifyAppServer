const request = require("supertest");
const app = require("../app");

describe.skip("Testing the user routes", () => {
  it("GET /users, return all users within the system", () => {
    return request(app)
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
});
