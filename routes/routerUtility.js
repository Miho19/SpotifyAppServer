const { AppError } = require("../src/errors/AppError");
const { userGetBySessionID } = require("../src/utils");

function routerUtilityRetrieveUserObject(sessionObject) {
  const { id: userSessionID } = sessionObject;
  const userObject = userGetBySessionID(userSessionID);

  return userObject;
}

module.exports = { routerUtilityRetrieveUserObject };
