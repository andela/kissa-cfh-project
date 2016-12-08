/*  eslint amd:true */
/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const Auth = {
  responseData: (res, status, success, message, token) => {
    res.status(status).json({
      success,
      message,
      token
    });
  },

  login(req, res) {
    User.findOne({
      email: req.body.email
    }, (error, user) => {
      if (error) {
        res.status(500).send(error);
      }
      if (!user) {
        Auth.responseData(res, 401, false, 'Authentication failed');
      } else if (user) {
        if (!user.authenticate(req.body.password)) {
          Auth.responseData(res, 401, false, 'Authentication failed. Invalid Password');
        } else {
          const token = jwt.sign(user, process.env.secret, {
            expiresIn: '24h'
          });
          Auth.responseData(res, 200, true, 'Authentication successful. User logged in', token);
        }
      }
    });
  }

};
module.exports = Auth;
