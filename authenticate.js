// here we will configure authentication strategies

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // this will export the strategy 

var User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
// here we are using all the plugins passport, passport local and the passport local mongoose in this single line
    // User.authenicate is the function provided by passport-local-mongoose that we have required in our schema

// inside the LocalStrategy(<here..>) , if we dont want to use passport local mongoose, then we
    //    have to write our own strategy here


// since we are using sessions with passport we need to specify this and this will take care of everything    
// these functions are provided by the user schema and model and we can user them here
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// req.user contain user info, so this will serialize and deserialize
// since we are using sessions along with the passport, therefore we need to serialize and
    // de serialize our users.