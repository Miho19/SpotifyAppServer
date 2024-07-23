const { userObjectTest } = require("./spotifyUserTestUtilities");
const MysqlLocalHost = require("../src/database/mysqlLocalHost");

describe("MySQL Local Host Testing", () => {
  let mysqlLocalHost;

  beforeAll(async () => {
    mysqlLocalHost = new MysqlLocalHost();

    await mysqlLocalHost.initialise();
  });

  afterAll(async () => {
    await mysqlLocalHost.destroy();
  });

  afterEach(async () => {
    await mysqlLocalHost.usersRemoveAll();
  });

  test("Connection is Established", async () => {
    try {
      await mysqlLocalHost.connection.ping();
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });

  test("Create a new user and retrieve their record", async () => {
    try {
      await mysqlLocalHost.usersAdd(userObjectTest);
      const result = await mysqlLocalHost.usersGet(userObjectTest.sessionID);
      expect(result).toBeTruthy();
      const user = result[0];

      expect(user).toEqual(
        expect.objectContaining({
          accessToken: userObjectTest.userProfile.identities[0].access_token,
          spotifyID: userObjectTest.userProfile.identities[0].user_id,
          displayName: userObjectTest.userProfile.display_name,
          image: userObjectTest.userProfile.images[0].url,
        })
      );
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });

  test("Create a new user and delete", async () => {
    try {
      await mysqlLocalHost.usersAdd(userObjectTest);
      await mysqlLocalHost.usersRemove(userObjectTest.sessionID);
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
