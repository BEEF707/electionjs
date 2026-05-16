var express = require('express');
var router = express.Router();
var { users, findUser, updateRole, allowedRoles } = require('../utils/users');

function requireLogin(req, res, next) {
  if (req.cookies && req.cookies.loggedIn === 'true') {
    return next();
  }
  res.redirect('/login');
}

router.get('/', requireLogin, function(req, res, next) {
  var currentUsername = req.cookies.username;
  var currentUser = findUser(currentUsername);
  if (!currentUser) {
    return res.redirect('/login');
  }

  var allUsers = currentUser.role === 'super' ? users : null;
  res.render('Dashboard', {
    title: 'Dashboard',
    role: currentUser.role,
    userinfo: currentUser,
    allUsers: allUsers,
  });
});

router.post('/changerole', requireLogin, function(req, res, next) {
  var currentUser = findUser(req.cookies.username);
  if (!currentUser || currentUser.role !== 'super') {
    return res.status(403).send('Forbidden: only super users can change roles.');
  }

  var username = req.body.username;
  var role = req.body.role;
  if (!allowedRoles.includes(role)) {
    return res.status(400).send('Invalid role.');
  }

  if (!updateRole(username, role)) {
    return res.status(404).send('User not found.');
  }

  res.redirect('/dashboard');
});

module.exports = router;
