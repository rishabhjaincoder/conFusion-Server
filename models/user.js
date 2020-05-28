var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// we have removed username and password field from here coz passport local mongoose will take care of that
var User  = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId : String,
    admin:{
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);
// this will store the username and the hashed password here
// and by this we can use many functions that we can use later in the user authentication

module.exports = mongoose.model('User',User);       