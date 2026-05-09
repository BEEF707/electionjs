var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  // Placeholder logic: always log in for demo
  res.cookie('loggedIn', 'true', { httpOnly: true });
  res.redirect('/election');
});

module.exports = router;