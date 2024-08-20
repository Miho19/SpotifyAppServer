const mysql = require("mysql2/promise");
const { AppError } = require("../errors/AppError");
const {
  UsersDatabaseCreateUserObject,
  UsersDatabaseConvertObjectToServerObject,
} = require("./Utility");

const mysqlConfig = {
  host: process.env.MYSQHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
};

class MysqlLocalHost {
  static #instance;
  #connection;

  constructor() {
    if (!MysqlLocalHost.#instance) MysqlLocalHost.#instance = this;
    return MysqlLocalHost.#instance;
  }

  get connection() {
    return this.#connection;
  }

  async initialise() {
    if (this.#connection) return this.#connection;
    this.#connection = await mysql.createConnection(mysqlConfig);
    await this.#connection.query("USE spotifyServerApp");
    return this.#connection;
  }

  async #usersAddToDatabaseUtility(sessionID, spotifyUserObject) {
    try {
      const [results, fields] = await this.#connection.query(
        "INSERT INTO users (u_sid, u_accessToken, u_displayName, u_imageURL, u_spotifyID) VALUES(?, ?, ?, ?, ?)",
        [
          sessionID,
          spotifyUserObject.accessToken,
          spotifyUserObject.displayName,
          spotifyUserObject.imageURL,
          spotifyUserObject.userID,
        ]
      );
    } catch (error) {}
  }

  async #usersQueryForAccessToken(spotifyUserObject) {
    const [results, fields] = await this.#connection.query(
      "SELECT * FROM users WHERE (u_accessToken = ?)",
      [spotifyUserObject.accessToken]
    );

    if (results.length === 0) return;

    return results;
  }

  async usersAdd(auth0UserObject) {
    if (!auth0UserObject) return;

    try {
      const spotifyUserObject = UsersDatabaseCreateUserObject(auth0UserObject);

      const usersObjectQueriedByAccessTokenArray =
        await this.#usersQueryForAccessToken(spotifyUserObject);

      if (usersObjectQueriedByAccessTokenArray) {
        const { u_sid: sessionID } = usersObjectQueriedByAccessTokenArray[0];
        await this.#userRemoveUtility(sessionID);
      }

      await this.#usersAddToDatabaseUtility(
        auth0UserObject.sessionID,
        spotifyUserObject
      );

      return {
        accessToken: spotifyUserObject.accessToken,
        displayName: spotifyUserObject.displayName,
        image: spotifyUserObject.imageURL,
        spotifyID: spotifyUserObject.userID,
      };
    } catch (error) {
      throw new AppError(500, "Failed to add user to database");
    }
  }

  async usersRemoveAll() {
    try {
      await this.#connection.query("TRUNCATE TABLE users");
    } catch (error) {
      throw new AppError(500, "Failed to clear all user records");
    }
  }

  async usersPrepareGetResults(results) {
    return results.map((user) => {
      return UsersDatabaseConvertObjectToServerObject(user);
    });
  }

  async usersGet(sessionIDArray) {
    if (!(sessionIDArray instanceof Array)) sessionIDArray = [sessionIDArray];

    try {
      const resultArray = await Promise.all(
        sessionIDArray.map(async (sessionID) => {
          const userDatabaseObject = await this.#userGetUtitility(sessionID);
          if (!userDatabaseObject) return;

          const userServerObject =
            UsersDatabaseConvertObjectToServerObject(userDatabaseObject);
          return userServerObject;
        })
      );

      return resultArray;
    } catch (error) {
      console.log(error);
      throw new AppError(500, "Failed to get users from database");
    }
  }

  async #userGetUtitility(sessionID) {
    if (!sessionID) return;

    const [results, fields] = await this.#connection.query(
      "SELECT * FROM users WHERE u_sid=?",
      [sessionID]
    );

    if (!results) return;

    return results[0];
  }

  async usersRemove(sessionIDArray) {
    if (!(sessionIDArray instanceof Array)) sessionIDArray = [sessionIDArray];

    try {
      const resultArray = sessionIDArray.map((sessionID) => {
        return this.#userRemoveUtility(sessionID);
      });

      return resultArray;
    } catch (error) {
      throw new AppError(500, "Failed to remove users from database");
    }
  }

  async #userRemoveUtility(sessionID) {
    if (!sessionID) return;
    try {
      const [results, fields] = await this.#connection.query(
        "DELETE FROM users WHERE u_sid=?",
        [sessionID]
      );

      return;
    } catch (error) {
      throw new AppError(500, "Failed to remove user from database");
    }
  }

  async destroy() {
    await this.#connection.end();
  }
}

module.exports = MysqlLocalHost;
