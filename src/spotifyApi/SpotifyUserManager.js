class SpotifyUserManager {
  #auth0UserObject;

  constructor(auth0UserObject) {
    this.#auth0UserObject = auth0UserObject;
  }

  get accessToken() {
    return this.#auth0UserObject.userProfile.identities[0].access_token;
  }

  get userID() {
    return this.#auth0UserObject.userProfile.identities[0].user_id;
  }
}

module.exports = { SpotifyUserManager };
