const { AppError } = require("../errors/AppError");

class Auth0Manager {
  #accessToken;
  static #instance;
  constructor() {
    if (!Auth0Manager.#instance) Auth0Manager.#instance = this;
    return Auth0Manager.#instance;
  }

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
      console.log(errors);
      throw new AppError(500, "Unable to initialise Auth0 Management System");
    }
  }

  get auth0AccessToken() {
    return this.#accessToken;
  }
}

module.exports = Auth0Manager;
