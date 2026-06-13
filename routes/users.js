var express = require('express');
var router = express.Router();
const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

const usersFile = path.join(__dirname, '../users.json');

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Middleware to check user role
function requireRole(role) {
  return function(req, res, next) {
    if (req.session.user && req.session.user.role === role) {
      return next();
    } else {
      res.status(403).send('Access denied');
    }
  };
}

// Load users from file
function loadUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Save users to file
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Ensure super admin exists
function ensureSuperAdmin() {
  const users = loadUsers();
  const superAdmin = users.find(u => u.role === 'super_admin');
  if (!superAdmin) {
    const hashedPassword = bcrypt.hashSync('admin123', 10); // Default password
    users.push({
      id: 1,
      username: 'superadmin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'super_admin'
    });
    saveUsers(users);
  }
}

ensureSuperAdmin();

/* GET login page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', result: '' });
});

/* POST login */
router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.redirect('/dashboard');
  } else {
    res.render('login', { title: 'Login', result: 'Invalid username or password' });
  }
});

/* GET register page */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register', licensecode: undefined });
});

/* POST register */
router.post('/register', function(req, res, next) {
  const { username, email, password, role } = req.body;
  const users = loadUsers();

  // Check if username or email already exists
  if (users.find(u => u.username === username || u.email === email)) {
    res.render('register', { title: 'Register', licensecode: 'Username or email already exists' });
    return;
  }

  // Only allow registration for voter, moderator, reporter
  if (!['voter', 'moderator', 'reporter'].includes(role)) {
    res.render('register', { title: 'Register', licensecode: 'Invalid role' });
    return;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    role
  };
  users.push(newUser);
  saveUsers(users);

  res.render('register', { title: 'Register', licensecode: 'Registration successful' });
});

/* GET logout */
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/login');
});

/* GET dashboard - requires auth */
router.get('/dashboard', requireAuth, function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard', user: req.session.user });
});

/* GET election - requires auth */
router.get('/election', requireAuth, function(req, res, next) {
  // Voters can vote, admins cannot
  const canVote = req.session.user.role === 'voter';
  res.render('election', { title: 'Election', user: req.session.user, canVote });
});

/* GET history - requires auth */
router.get('/history', requireAuth, function(req, res, next) {
  res.render('history', { title: 'History', user: req.session.user });
});

/* GET admin panel - requires admin or super_admin */
router.get('/admin', requireAuth, requireRole('administrator'), function(req, res, next) {
  const users = loadUsers();
  res.render('admin', { title: 'Admin Panel', user: req.session.user, users });
});

/* POST create admin - requires super_admin */
router.post('/create-admin', requireAuth, requireRole('super_admin'), function(req, res, next) {
  const { username, email, password } = req.body;
  const users = loadUsers();

  if (users.find(u => u.username === username || u.email === email)) {
    res.redirect('/admin?error=Username or email already exists');
    return;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newAdmin = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    role: 'administrator'
  };
  users.push(newAdmin);
  saveUsers(users);

  res.redirect('/admin');
});

/* GET reporter view - requires reporter */
router.get('/reporter', requireAuth, requireRole('reporter'), function(req, res, next) {
  // Mock past elections
  const pastElections = [
    { id: 1, name: 'Election 2020', status: 'closed' },
    { id: 2, name: 'Election 2022', status: 'closed' }
  ];
  res.render('reporter', { title: 'Reporter Dashboard', user: req.session.user, elections: pastElections });
});

module.exports = router;
