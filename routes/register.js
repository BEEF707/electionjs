var express = require('express');
var router = express.Router();

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/', function(req, res, next) {
  // Placeholder registration: just redirect to login after submit
  res.redirect('/login');
});

module.exports = router;
