'use strict';

var User = require('../models/user.js');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
  var config = {
    'clientID'      : process.env.FB_APP_ID,
    'clientSecret'  : process.env.FB_APP_SECRET,
    'callbackURL'   : 'http://localhost:8081/auth/facebook/callback'  // TODO: set url based on dev or production
  }

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user._id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'facebookID' : profile.id }, function(err, user) {
          if(err) {
            return done(err);
          }

          // user has account
          if(user) {
            User.findOneAndUpdate({ _id: user._id }, {
              accessToken: accessToken
            }, { new: true }, function(err, _user) {
              return done(null, _user);
            });
          } else {
              // create new user
              var newUser = new User({
                facebookID: profile.id,
                name: profile.displayName || profile.name.givenName + ' ' + profile.name.familyName,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : undefined,
                created: Date.now(),
                type: "standard",
                accessToken: accessToken
              });

              newUser.save(function(err) {
                if(err) {
                  return done(err);
                }
                return done(null, newUser);
              });
          }
      });
    }
  ));
}
