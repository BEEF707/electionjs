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
    var err = new Error('Forbidden: only super users can change roles.');
    err.status = 403;
    return next(err);
  }

  var username = req.body.username;
  var role = req.body.role;
  if (!allowedRoles.includes(role)) {
    var err = new Error('Invalid role.');
    err.status = 400;
    return next(err);
  }

  if (!updateRole(username, role)) {
    var err = new Error('User not found.');
    err.status = 404;
    return next(err);
  }

  res.redirect('/dashboard');
});

module.exports = router;
