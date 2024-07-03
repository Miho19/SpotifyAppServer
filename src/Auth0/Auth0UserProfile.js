const { AppError } = require("../errors/AppError");

class Auth0UserProfile {
  #AuthenticationManager;
  #Auth0UserID;
  constructor(Auth0Manager, Auth0UserID) {
    if (!Auth0Manager.auth0AccessToken) {
      Auth0Manager.initialise()
        .then((response) => (this.#AuthenticationManager = Auth0Manager))
        .catch((err) => console.log(err));
    } else {
      this.#AuthenticationManager = Auth0Manager;
    }

    if (!Auth0UserID) throw new AppError(500, "Internal Server Error");
    this.#Auth0UserID = Auth0UserID;
  }

  async FetchUserProfile() {
    const accessToken = this.#AuthenticationManager.auth0AccessToken;

    let options = {
      method: "GET",
      headers: { authorization: `Bearer ${accessToken}` },
    };

    try {
      const response = await fetch(
        `${process.env.AUTH0MANAGEMENTDOMAIN}/api/v2/users/${
          this.#Auth0UserID
        }`,
        options
      );
      const body = await response.json();
      return body;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Auth0UserProfile;
