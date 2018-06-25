const express = require('express');
const router = express.Router();
const authService = require('../services/auth');
const { passportLocalSignIn, isAuthenticated, passportGoogleSignIn, passportFacebookSignIn } = require('../utils/middleware');

router.post('/register', (req, res, next) => {
  authService.register(req.body, (data, err) => {
    if (err) {

      return res.status(err.status).json(
        {
          path: req.url,
          method: req.method,
          message: err.error,
          status: err.status
        });
    }

    return res.status(data.status).json({
      success: data.success,
      email: data.email
    })
  })
});

router.post('/login', passportLocalSignIn, (req, res, next) => {
  authService.login(req, data => {
    res.status(200).json(data)
  });
});

router.get('/login/google', passportGoogleSignIn);

router.get('/google/callback', passportGoogleSignIn, (req, res) => {
  authService.login(req, data => {
    res.status(200).json(data)
  });
});

router.get('/login/facebook', passportFacebookSignIn);

router.get('/facebook/callback', passportFacebookSignIn, (req, res) => {
  authService.login(req, data => {
    res.status(200).json(data)
  });
});

module.exports = router;