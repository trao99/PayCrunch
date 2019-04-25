const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome
router.get('/', (req, res) => res.render('welcome'));

//dashboard
// router.get('/dashboard', ensureAuthenticated, (req, res) =>
//   res.render('dashboard', {
//     name: req.user.name
// }));

router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('/Users/veronica/Desktop/cScience/cs252/PayCrunch/loginForm/public/index00.html'));

module.exports = router;
