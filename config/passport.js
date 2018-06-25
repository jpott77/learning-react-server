const passport = require('passport');
const fs = require('fs');
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const config = require('../config/constants');
const UserModel = require('../models/User');

const publicKey = fs.readFileSync('./config/jwt.key.pub', 'utf8')
const jwtOptions = {}

jwtOptions.jwtFromRequest = ExtractJwt.fromHeader("authorization")
jwtOptions.secretOrKey = publicKey;
jwtOptions.ignoreExpiration = false;
jwtOptions.algorithms = ['RS512']

//jwt config; used to authorize requests
const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
  console.log('payload received', jwtPayload);

  UserModel.findById(jwtPayload.sub, (err, user) => {
    //console.log(user.toJSON())
    if (err) {
      next(err, null)
    }
    if (user) {
      next(null, user)
    } else {
      next(null, null)
    }
  })
});

//local config: used to login with a username/password
const localStrategy = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
  function (username, password, cb) {
    UserModel.findOne({ username: username }, (err, user) => {
      if (err) {
        return cb(err);
      }
      if (!user || !user.verifyPasswordSync(password)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }

      return cb(null, user, { message: 'Logged In Successfully' });
    })
  });

//google config: used to login with google
const googleStrategy = new GoogleStrategy({
  clientID: config.passport.google.id,
  clientSecret: config.passport.google.secret,
  scope: ['https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'],
  callbackURL: config.appURL + '/api/auth/google/callback/'
},
  function (accessToken, refreshToken, profile, cb) {

    UserModel.findOne({ 'google.profileId': profile.id }, function (err, user) {
      if (err) {
        return cb(err);
      }
      console.log(profile)
      //No user was found... so create a new user with values from Facebook (all the profile. stuff)
      if (!user) {
        user = new UserModel({
          username: profile.displayName,
          google: {
            profileId: profile.id,
            image: profile._json.image.url,
            refreshToken: refreshToken,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value
          }
        });
        user.save(function (err) {
          if (err) console.log(err);
          return cb(err, user);
        });
      } else {
        //found user. Return
        return cb(err, user);
      }
    });
  });

const facebookStrategy = new FacebookStrategy({
  clientID: config.passport.facebook.id,
  clientSecret: config.passport.facebook.secret,
  scope: ['email'],
  callbackURL: config.appURL + '/api/auth/facebook/callback/',
  profileFields: ['id', 'email', 'displayName', 'photos', 'name']
},
  function (accessToken, refreshToken, profile, cb) {

    UserModel.findOne({ 'facebook.profileId': profile.id }, function (err, user) {
      if (err) {
        return cb(err);
      }
      console.log(profile)
      //No user was found... so create a new user with values from Facebook (all the profile. stuff)
      if (!user) {
        user = new UserModel({
          username: profile.displayName,
          facebook: {
            profileId: profile.id,
            image: profile.photos[0].value,
            refreshToken: refreshToken,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value
          }
        });
        user.save(function (err) {
          if (err) console.log(err);
          return cb(err, user);
        });
      } else {
        //found user. Return
        return cb(err, user);
      }
    });
  });


passport.use(facebookStrategy);
passport.use(googleStrategy);
passport.use(localStrategy);
passport.use(jwtStrategy);

module.exports = passport;