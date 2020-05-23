var express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
var User = require('../models/user'); 

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) {  // if the username is not equal to null that means user exists and we throw a error
        var err = new Error('User ' + req.body.username + ' already exists!');
        err.status = 403;
        next(err);
      }
      else { // else username is not present in the req.body and we have to create a user and then return it
        return User.create({
          username: req.body.username,
          password: req.body.password
        })
      }
    })
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'Registration Successful!', user: user });
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error('You are not authenticated! ');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401; // 401 means not authenticated
      return next(err); // error handler will handle this error 
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

    var username = auth[0];
    var password = auth[1];

    // changed this part and baki sara app.js se copy
    User.findOne({ username: username }) // this will return username and password in then()
      .then((user) => {
        if (user === null) {
          var err = new Error('User ' + user + ' does not exists!');
          err.status = 403;
          return next(err);
        }
        else if (user.password !== password) {
          var err = new Error('Your Password is incorrect!');
          err.status = 403;
          return next(err);
        }

        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!');
        }

      })
      .catch((err) => next(err));
  }
  else { // if user session is already created before then
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated');
  }
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
