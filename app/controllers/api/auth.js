/* eslint amd:true */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const Auth = {
  responseData(res, status, success, message, token) {
    res.status(status).json({
      success,
      message,
      token
    });
  },
  saveUser(res, status, user) {
    user.save((err, newUser) => {
      if (err) return err;
      const token = jwt.sign(newUser, process.env.secret, {
        expiresIn: '24h'
      });
      Auth.responseData(res, status, true, 'You have successfully signed up!', token);
    });
  },
  signUp(req, res) {
    User.findOne({ email: req.body.email }, (error, registeredUser) => {
      if (error) return error;
      // Check if email does not exists
      if (!registeredUser) {
        const body = req.body;
        if (body.email && body.name && body.password) {
          const user = new User();
          user.email = body.email;
          user.name = body.name;
          user.password = body.password;
          user.avatar = body.avatar;
          Auth.saveUser(res, 200, user);
        } else {
          Auth.responseData(res, 400, false, 'Authentication failed. No field can be empty!');
        }
      } else {
        Auth.responseData(res, 409, false, 'User already exists');
      }
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
