const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User models
const User = require('../models/user');

// Log in page
router.get('/login', (req, res) => res.render('login'));

// Register page
router.get('/register', (req, res) => res.render('register'));

// Register handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  // All fields are inserted
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'You are missing a field!' });
  }

  // Checking if both passwords math
  if (password != password2) {
   errors.push({ msg: 'Passwords do not match' });
 }

 // Checking password length
 if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash('success_msg','You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;


/*
const User = require('../models/user');
const passport = require('passport');

router.post('/signup', (req, res, next) => {
  User.register(new User({
      username: req.body.username
    }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          err: err
        });
      } else {
        passport.authenticate('local')(req, res, () => {
          User.findOne({
            username: req.body.username
          }, (err, person) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              status: 'Registration Successful!',
            });
          });
        })
      }
    })
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, person) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      status: 'You are successfully logged in!'
    });
  })
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.logout();
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.clearCookie('session-id');
        res.json({
          message: 'You are successfully logged out!'
        });
      }
    });
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
*/
