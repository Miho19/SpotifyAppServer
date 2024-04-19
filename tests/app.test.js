const request = require("supertest");
const app = require("../app");

describe("Generic Server Testing", () => {
  test("undefined route should result in 404", () => {
    request(app).get("/").expect(404);
  });
});
