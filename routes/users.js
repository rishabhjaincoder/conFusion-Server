var express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');

const mongoose = require('mongoose');
var User = require('../models/user'); 

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// we have done this thing using passport mongoose functions
router.post('/signup', (req, res, next) => {
  // User.register is a pass local mon. function to create a user and this takes 3 parameters
      // username password and a function
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
});


router.get('/logout', (req, res) => { // here we have used get to logout coz we are not storing any data onto server
  if (req.session) {  // if session exists then delete the cookie
    req.session.destroy();  // this will delete the session file from the server
    res.clearCookie('session-id');
    res.redirect('/'); // this will redirect the user to the homepage
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;  // forbidden operation
    next(err);
  }
});

module.exports = router;
