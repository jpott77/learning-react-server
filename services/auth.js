const jwt = require('jsonwebtoken')
const fs = require('fs')
const passport = require('passport')
const config = require('../config/constants')
const User = require('../models/User')

module.exports.register = (body, cb) => {
  const username = body.username;
  const password = body.password;

  if (!username || !password) {
    return cb(null, { status: 422, error: 'You must provide an username and a password' })
  }


  User.findOne({ username: username }, ['username', 'id'], (err, existingUser) => {
    if (err) {
      return cb(null, { status: 500, error: 'Cannot retrieve user' });
    }

    if (existingUser) {
      return cb(null, { status: 409, error: 'Username already exists' });
    }

    const newUser = new User({
      username: username,
      password: password
    });

    newUser.save(err => {
      if (err) {
        return cb(null, { status: 500, error: 'Cannot save user' });
      }
      else {
        return cb({ email: newUser.email, success: true, status:200 }, null)
      }

    });
  });
}

//should return a token for a valid user based on body
module.exports.login = (req, cb) => {
  cb({ token: generateToken(req.user, '1h') })
}

module.exports.logout = (req, cb) => {

}

const generateToken = (user, exp) => {
  const privateKey = fs.readFileSync('./config/jwt.key', 'utf8')
  const token = jwt.sign({
    sub: user.id,
    role: user.role,
    active: user.active,
  }, privateKey, {
      expiresIn: exp,
      algorithm: 'RS512'
    });
  return token;
}
