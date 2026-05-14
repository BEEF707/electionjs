var express = require('express');
var router = express.Router();

/* GET roleplacement page. */
router.get('/', function(req, res, next) {
  res.render('Utils/roleplacement', { title: 'Role Placement' });
});

module.exports = router;
