// here we will be writing all the configuration for our server
// will specify a secret key, which will be used to sign out token

module.exports = {
    'secretKey':'12345-67890-09876-54321',
    'mongoUrl':'mongodb://localhost:27017/conFusion',
    'facebook': {
        clientId: '893247471176536',
        clientSecret: 'c911d0767d08a729311dee995ed87194' 
    }
}