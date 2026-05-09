var express = require('express');
var router = express.Router();

function requireLogin(req, res, next) {
  if (req.cookies && req.cookies.loggedIn === 'true') {
    return next();
  }
  res.redirect('/login');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

/* GET election page. */
router.get('/election', requireLogin, function(req, res, next) {
  res.render('election', { ElectionsArray: [], after: null });
});

module.exports = router;
