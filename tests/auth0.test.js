const Auth0Manager = require("../src/Auth0/Auth0");

const initialiseMock = jest.spyOn(Auth0Manager.prototype, "initialise");

describe("Auth0", () => {
  describe("Creating new users", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("is initialise called", async () => {
      const auth0 = new Auth0Manager();
      await auth0.initialise();
      expect(initialiseMock).toHaveBeenCalled();
    });
  });
});
