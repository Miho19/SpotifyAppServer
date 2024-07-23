const request = require("supertest");
const init = require("../app");

describe("Generic Server Testing", () => {
  let app;
  beforeAll(async () => {
    app = await init();
  });
  test("undefined route should result in 404", () => {
    return request(app).get("/").expect(404);
  });
});
