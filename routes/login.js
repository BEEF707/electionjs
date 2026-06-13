var express = require('express');
var router = express.Router();
var { authenticate } = require('../utils/users');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', error: null });
});

router.post('/', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let user = authenticate(username, password);

  if (!user) {
    return res.render('login', {
      title: 'Login',
      error: 'Invalid username or password.',
    });
  }

  res.cookie('loggedIn', 'true', { httpOnly: true });
  res.cookie('username', user.username, { httpOnly: true });
  res.cookie('role', user.role, { httpOnly: true });
  res.redirect('/dashboard');
});

module.exports = router;