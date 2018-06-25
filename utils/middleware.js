const passport = require('passport');

module.exports.notFound = (req, res, next) => {
  res.status(404).json({
    path: req.url,
    method: req.method,
    message: 'Route does not exist',
    status: 404
  });
}

module.exports.passportLocalSignIn = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        path: req.url,
        method: req.method,
        message: err,
        status: 500
      });
    }
    if (!user) {
      return res.status(401).json({
        path: req.url,
        method: req.method,
        message: info.message,
        status: 401
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      next();
    });
  })(req, res, next);
}

module.exports.passportGoogleSignIn = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        path: req.url,
        method: req.method,
        message: err,
        status: 500
      });
    }
    if (!user) {
      return res.status(401).json({
        path: req.url,
        method: req.method,
        message: info.message,
        status: 401
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      next();
    });
  })(req, res, next);
}

module.exports.passportFacebookSignIn = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        path: req.url,
        method: req.method,
        message: err,
        status: 500
      });
    }
    if (!user) {
      return res.status(401).json({
        path: req.url,
        method: req.method,
        message: info.message,
        status: 401
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      next();
    });
  })(req, res, next);
}