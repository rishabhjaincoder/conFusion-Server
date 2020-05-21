var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
app.use(cookieParser());

// at this point we will authenticate user coz from here user can request for the data and access that data
var auth =(req,res,next)=>{
  // just to check what is in the request header
  console.log(req.headers);

  // this authHeader will contain the complete strong,    basic <username:password>  ,so we will extract them later
  var authHeader = req.headers.authorization;

// this will run if the authheader/username,password is not given by the user
  if (!authHeader){   
    var err = new Error('You are not authenticated! ');
    res.setHeader('WWW-Authenticate','Basic');
    err.status = 401; // 401 means not authenticated
    return next(err); // error handler will handle this error 
  }

  // this auth will contain an array with the username and the password
  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  // we are spliting the authHeader 2 times, first this will seperate [basic,username:pass] and then select 
  // the user:pass from the array and then split again and make a array of username and password

  var username = auth[0];
  var password = auth[1];

  // here we are using a fix username and password for this exercise, but lateron we will allow user
  // to create username and the password by himself
  if (username === 'admin' && password === 'password'){ // === means this will check for the datatype also
    next(); // this means if the user is authenticated then allow him to proceed forward and use the
              // middleware needed to complete this request
  }
  else{
    // here we have to again challenge user to send correct username and password to authorize
    var err = new Error('You are not authenticated! ');
    res.setHeader('WWW-Authenticate','Basic');
    err.status = 401; 
    return next(err); // error handler will take care of that
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
