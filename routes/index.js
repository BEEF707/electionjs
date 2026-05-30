var express = require('express');
var router = express.Router();
var { getElections, addElection, findElection } = require('../utils/elections');

function requireLogin(req, res, next) {
  if (req.cookies && req.cookies.loggedIn === 'true') {
    return next();
  }
  res.redirect('/login');
}

function getThemeForWord(word) {
  var keyword = String(word || '').trim().toLowerCase();

  var themes = {
    leadership: {
      bg: 'linear-gradient(135deg, rgba(84, 108, 255, 0.22), rgba(30, 65, 159, 0.95))',
      border: 'rgba(120, 149, 255, 0.55)',
      badge: 'rgba(120, 149, 255, 0.88)',
    },
    change: {
      bg: 'linear-gradient(135deg, rgba(255, 180, 85, 0.18), rgba(170, 95, 25, 0.9))',
      border: 'rgba(255, 183, 75, 0.72)',
      badge: 'rgba(255, 183, 75, 0.9)',
    },
    mango: {
      bg: 'linear-gradient(135deg, rgba(255, 189, 89, 0.2), rgba(217, 121, 20, 0.92))',
      border: 'rgba(255, 184, 72, 0.75)',
      badge: 'rgba(255, 190, 102, 0.95)',
    },
    unity: {
      bg: 'linear-gradient(135deg, rgba(90, 225, 170, 0.18), rgba(17, 73, 71, 0.9))',
      border: 'rgba(96, 230, 175, 0.72)',
      badge: 'rgba(96, 230, 175, 0.92)',
    },
    innovation: {
      bg: 'linear-gradient(135deg, rgba(153, 102, 255, 0.18), rgba(63, 26, 112, 0.95))',
      border: 'rgba(179, 129, 255, 0.64)',
      badge: 'rgba(179, 129, 255, 0.92)',
    },
    trust: {
      bg: 'linear-gradient(135deg, rgba(88, 178, 255, 0.18), rgba(11, 61, 108, 0.92))',
      border: 'rgba(120, 210, 255, 0.6)',
      badge: 'rgba(120, 210, 255, 0.92)',
    },
    bold: {
      bg: 'linear-gradient(135deg, rgba(255, 90, 122, 0.18), rgba(115, 13, 45, 0.9))',
      border: 'rgba(255, 110, 145, 0.7)',
      badge: 'rgba(255, 110, 145, 0.9)',
    },
  };

  if (themes[keyword]) {
    return themes[keyword];
  }

  if (!keyword) {
    return {
      bg: 'rgba(12, 24, 42, 0.95)',
      border: 'rgba(255, 255, 255, 0.12)',
      badge: 'rgba(126, 203, 255, 0.9)',
    };
  }

  var hash = 0;
  for (var i = 0; i < keyword.length; i += 1) {
    hash = (hash * 31 + keyword.charCodeAt(i)) | 0;
  }
  var hue = ((hash % 360) + 360) % 360;
  return {
    bg: 'linear-gradient(135deg, hsla(' + hue + ', 75%, 70%, 0.18), hsla(' + hue + ', 45%, 14%, 0.94))',
    border: 'hsla(' + hue + ', 75%, 70%, 0.62)',
    badge: 'hsla(' + hue + ', 78%, 68%, 0.88)',
  };
}

function styleElection(election) {
  var theme = getThemeForWord(election.specialWord);
  return Object.assign({}, election, {
    cardStyle: 'background-image: ' + theme.bg + '; border: 2px solid ' + theme.border + ';',
    badgeStyle: 'background: ' + theme.badge + '; color: #081229;',
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

/* GET election page. */
router.get('/election', requireLogin, function(req, res, next) {
  var role = req.cookies.role || '';
  var votingEnabled = role === 'voter';
  var restricted = role === 'moderator';

  res.render('election', {
    ElectionsArray: getElections().map(styleElection),
    role: role,
    votingEnabled: votingEnabled,
    restricted: restricted,
  });
});

router.get('/elections', requireLogin, function(req, res, next) {
  var role = req.cookies.role || '';
  var votingEnabled = role === 'voter';
  var restricted = role === 'moderator';

  res.render('election', {
    ElectionsArray: getElections().map(styleElection),
    role: role,
    votingEnabled: votingEnabled,
    restricted: restricted,
  });
});

router.get('/election/create', requireLogin, function(req, res, next) {
  res.render('createElection', { title: 'Create Election', error: null, formData: {} });
});

router.get('/createElection', requireLogin, function(req, res, next) {
  res.render('createElection', { title: 'Create Election', error: null, formData: {} });
});

router.post('/election/create', requireLogin, function(req, res, next) {
  var title = req.body.title;
  var description = req.body.description;
  var specialWord = req.body.specialWord || '';
  var username = req.cookies.username || 'unknown';

  if (!title || !description) {
    return res.render('createElection', {
      title: 'Create Election',
      error: 'Title and description are required.',
      formData: req.body,
    });
  }

  var newElection = {
    election_id: String(Date.now()),
    title: title,
    description: description,
    specialWord: specialWord,
    createdBy: username,
  };

  addElection(newElection);
  res.redirect('/election');
});

router.get('/viewelection/:id', requireLogin, function(req, res, next) {
  var role = req.cookies.role || '';
  var election = findElection(req.params.id);
  if (!election) {
    return res.status(404).send('Election not found.');
  }

  res.render('viewElection', {
    title: 'View Election',
    election: styleElection(election),
    role: role,
  });
});

module.exports = router;
