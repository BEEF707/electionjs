var express = require('express');
var router = express.Router();
var { addUser, findUser } = require('../utils/users');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register', error: null, formData: {} });
});

router.post('/', function(req, res, next) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var role = req.body.role || 'voter';
  var birthdate = req.body.birthdate || '';
  var age = req.body.age || '';
  var interests = req.body.interests || [];
  var grade = req.body.grade || '';

  if (!username || !email || !password) {
    return res.render('register', {
      title: 'Register',
      error: 'Username, email, and password are required.',
      formData: req.body,
    });
  }

  if (findUser(username)) {
    return res.render('register', {
      title: 'Register',
      error: 'Username already exists.',
      formData: req.body,
    });
  }

  addUser({
    username: username,
    email: email,
    password: password,
    role: role,
    birthdate: birthdate,
    age: age,
    interests: interests,
    grade: grade,
    city: '',
    state: '',
    zip: '',
    lastLoginTime: {},
    lastIP: {},
  });

  res.redirect('/login');
});

module.exports = router;
