var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// here cookie-parser is already required by the express generator
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session); // session is to be passed here

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

// requiring models and mongoose
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');

// establishing connection to mongodb server using mongoose 
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("\n\nconnected properly to the server!\n");
}, (err) => { console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// here express generator has already included cookie-parser as a express middleware
// but as we are using signed cookie,therefor we need to supply it with a key so that it can 
//    encrypt the information and sign the cookie that is sent from the server to client
// app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name : 'session-id',
  secret : '12345-67890-09876-54321',
  saveUninitialized : false,
  resave : false,
  store: new FileStore()
}));

var auth = (req, res, next) => {
  console.log(req.session);

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

    if (username === 'admin' && password === 'password') { // === means this will check for the datatype also
      req.session.user = 'admin';
      next();
    }
    else {
      // here we have to again challenge user to send correct username and password to authorize
      var err = new Error('You are not authenticated! ');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err); // error handler will take care of that
    }

  }
  else{
    if (req.session.user === 'admin'){
      next();
    }
    else{
      var err = new Error('You are not authenticated');
      err.status = 401;
      return next(err);
    }
  }

}

app.use(auth);

// for getting static content
app.use(express.static(path.join(__dirname, 'public')));
// for getting these routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
