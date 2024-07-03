const { AppError } = require("../src/errors/AppError");
const { userGetBySessionID } = require("../src/utils");

function routerUtilityRetrieveUserObject(sessionObject) {
  const { id: userSessionID } = sessionObject;

  const userObject = userGetBySessionID(userSessionID);

  return userObject;
}

/**
 * Add logging here if needed
 *
 */
async function routerControllerHandler(func, next) {
  try {
    await func();
  } catch (error) {
    if (error instanceof AppError) next(error);
  }
}

module.exports = { routerUtilityRetrieveUserObject, routerControllerHandler };
