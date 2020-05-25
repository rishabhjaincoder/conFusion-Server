var express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');

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
  // User.register is a passport local mongoose function to create a user and this takes 3 parameters
      // username password and a function
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      // adding firstname and lastname as well
      if(req.body.firstname){
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname){
        user.lastname = req.body.lastname;
      }
      user.save((err,user)=>{
        if (err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });

    }
  });
});

// here we will be using the token that we have implemented in the authentication.js file
// er will include _id in the getToken params as we dont want other things to get included in the token
router.post('/login', passport.authenticate('local'), (req, res) => {
  
  var token = authenticate.getToken({_id: req.user._id});
  // we are able to use req.user here coz this callback function gets called after passport.authenticate gets executed
  // and its the work of passport authenticate to adds user info to req.user
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
  // here in the res.json we will send back the token to the user in the form of string here
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
