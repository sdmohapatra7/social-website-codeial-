const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use a new strategy foe google login
passport.use(new googleStrategy({
    clientID: "270952757622-faonj5u1s17mp3bmbfca5l9rjiu68jls.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:2000/users/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        //find a user
        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) {
                console.log('Error In Passport-google', err);
                return;
            }
            // console.log(accessToken,refreshToken);
            // console.log(profile);
            if (user) {
                //if found set this user as req.user
                return done(null, user);
            } else {
                //if not found create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function (err, user) {
                    if (err) {
                        console.log('Error In createing User', err);
                        return;
                    }
                    return done(null, user);
                });
            }
        });
    }
));

module.exports = passport;

