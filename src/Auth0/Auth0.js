const { AppError } = require("../errors/AppError");

class Auth0Manager {
  #accessToken;

  constructor() {}

  async initialise() {
    if (this.#accessToken) return;

    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: `{"client_id":"${process.env.AUTH0CLIENTID}","client_secret":"${process.env.AUTH0CLIENTSECRET}","audience":"${process.env.AUTH0MANAGEMENTDOMAIN}/api/v2/","grant_type":"client_credentials"}`,
    };
    try {
      const response = await fetch(
        `${process.env.AUTH0MANAGEMENTDOMAIN}/oauth/token`,
        options
      );

      const body = await response.json();
      this.#accessToken = body.access_token;
    } catch (errors) {
      throw new AppError(500, "Unable to initialise Auth0 Management System");
    }
  }

  async FetchUserProfile(Auth0UserID) {
    if (!this.#accessToken) throw new AppError(500, "Internal Server Error");
    if (!Auth0UserID) throw new AppError(400, "Auth0 User ID missing");

    let options = {
      method: "GET",
      headers: { authorization: `Bearer ${this.#accessToken}` },
    };

    const response = await fetch(
      `${process.env.AUTH0MANAGEMENTDOMAIN}/api/v2/users/${Auth0UserID}`,
      options
    );
    const body = await response.json();
    return body;
  }

  get auth0AcessToken() {
    return this.#accessToken;
  }
}

module.exports = Auth0Manager;
