class SpotifyUserManager {
  #auth0UserObject;

  constructor(auth0UserObject) {
    this.#auth0UserObject = auth0UserObject;
  }

  get accessToken() {
    return this.#auth0UserObject.userProfile.identities[0].access_token;
  }

  get userID() {
    const spotifyID =
      this.#auth0UserObject.userProfile.identities[0].user_id.split("user:")[1];
    return spotifyID;
  }
}

module.exports = { SpotifyUserManager };
