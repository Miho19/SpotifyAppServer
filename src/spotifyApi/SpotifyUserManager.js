class SpotifyUserManager {
  #userObject;

  constructor(userObject) {
    this.#userObject = userObject;
  }

  get accessToken() {
    return this.#userObject.accessToken;
  }

  get userID() {
    const spotifyID = this.#userObject.spotifyID.split("user:")[1];
    return spotifyID;
  }
}

module.exports = { SpotifyUserManager };
