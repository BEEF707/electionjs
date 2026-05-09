var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', verifyToken, function(req, res, next) {
  res.render('index', { title: 'Express' , name:res.locals.name});
});

module.exports = router;