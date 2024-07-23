const { AppError } = require("../src/errors/AppError");

const MysqlLocalHost = require("../src/database/mysqlLocalHost");

const mysql = new MysqlLocalHost();

async function routerUtilityRetrieveUserObject(sessionObject) {
  const { id: userSessionID } = sessionObject;

  const databaseResultSet = await mysql.usersGet(userSessionID);
  const userObject = databaseResultSet[0];
  return userObject;
}

function routerUtilityRetrieveUserObjectRemoveAccessTokenCode(userObject) {
  if (!userObject) return;

  const { accessToken, ...updatedObject } = userObject;

  return updatedObject;
}

async function routerUtilityAddUser(userObject) {
  const resultUserObjectAdded = await mysql.usersAdd(userObject);
  const returnObject = routerUtilityRetrieveUserObjectRemoveAccessTokenCode(
    resultUserObjectAdded
  );

  return returnObject;
}

/**
 * Add logging here if needed
 *
 */
async function routerControllerHandler(func, next) {
  try {
    await func();
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) next(error);
  }
}

module.exports = {
  routerUtilityAddUser,
  routerUtilityRetrieveUserObject,
  routerControllerHandler,
  routerUtilityRetrieveUserObjectRemoveAccessTokenCode,
};
