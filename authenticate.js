// here we will configure authentication strategies

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; 
var User = require('./models/user');

// this will provide us with json web token based strategy
var JwtStrategy = require('passport-jwt').Strategy;
// this helps in extracting token from the incoming request
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
// this contains basic configuration of our project
var config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// here we will make a function to create a token
// we will be using this in the user router file later on

// here jwt.sign will adds a value in the payload of the token
            // and second parameter is the secret key
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

// these are the options that we need to specify here for jwt strategy
var opts={};

// this option tells how the jsonwebtoken should be extracted from the incoming request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // this will take the token from
                                                                // authentication header
    // this helps in supplying the secret key, which we will use in strategy for signin
opts.secretOrKey = config.secretKey;

// exporting and specifying jwt based strategy
// when passport parses the request mssg, it will use this strategy and then extract the information
                // and then load it into the request message
        // here done is a callback to this function
        exports.jwtPassport = passport.use(new JwtStrategy(opts,
            (jwt_payload, done) => {
                console.log("JWT payload: ", jwt_payload);
                User.findOne({_id: jwt_payload._id}, (err, user) => {
                    if (err) {
                        return done(err, false);
                    }
                    else if (user) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false);
                    }
                });
            }));

// we will be using this to verify the user
exports.verifyUser = passport.authenticate('jwt',{session:false});
// here jwt is the strategy that we will be using

exports.verifyAdmin = (req,res,next)=>{
    if(req.user.admin == false){
        var err = new Error('You are not authorized to perform this operation!  ');
        err.status = 403; 
        return next(err);
    }
    else if(req.user.admin == true){
        return next();
    }
};