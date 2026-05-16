const users = [];

const allowedRoles = ['voter', 'moderator', 'reporter', 'admin', 'super'];

function findUser(username) {
  return users.find((user) => user.username === username);
}

function addUser(user) {
  if (findUser(user.username)) {
    return false;
  }
  users.push(user);
  return true;
}

function authenticate(username, password) {
  const user = findUser(username);
  if (!user) {
    return null;
  }
  return user.password === password ? user : null;
}

function updateRole(username, role) {
  if (!allowedRoles.includes(role)) {
    return false;
  }
  const user = findUser(username);
  if (!user) {
    return false;
  }
  user.role = role;
  return true;
}

module.exports = {
  users,
  allowedRoles,
  findUser,
  addUser,
  authenticate,
  updateRole,
};
