let users = [];

const _userAdd = (userObject) => {
  users = [...users, userObject];
};

const userGetBySessionID = (sessionID) => {
  const userObject = users.find((user) => user.sessionID === sessionID);
  return userObject;
};

module.exports = {
  users,
  _userAdd,
  userGetBySessionID,
};
