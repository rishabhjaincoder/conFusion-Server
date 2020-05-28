var express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

const mongoose = require('mongoose');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err) => next(err))
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    });
});

// we have done this thing using passport mongoose functions
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  // User.register is a passport local mongoose function to create a user and this takes 3 parameters
  // username password and a function
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        // adding firstname and lastname as well
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });

      }
    });
});

// here we will be using the token that we have implemented in the authentication.js file
// er will include _id in the getToken params as we dont want other things to get included in the token
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({ _id: req.user._id });
  // we are able to use req.user here coz this callback function gets called after passport.authenticate gets executed
  // and its the work of passport authenticate to adds user info to req.user
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
  // here in the res.json we will send back the token to the user in the form of string here
});


router.get('/logout', cors.cors, (req, res) => { // here we have used get to logout coz we are not storing any data onto server
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

// if user sends a GET request to the server with this endpoint, then we will authenticate the user using facebook oauth strategy
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  // here after using passport.authenticate('facebook-token'), user data is available to us on req.user

  // imp** the user is sending the access token to the express server, the express server uses the 
  // accessToken to go to Facebook and then fetch the profile of the user. And if the user doesn't exist,
  //  we'll create a new user with that Facebook ID. And then after that, then our express server will
  // generate a JSON web token and then return the JSON web token to our client.
  if (req.user) {
    // here we will create a token as user is now registered with us and return that in response
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
  }
});

module.exports = router;
