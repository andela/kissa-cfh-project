/* eslint amd:true */
const mongoose = require('mongoose');

const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

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
          Auth.saveUser(res, 200,user);
        } else {
          Auth.responseData(res, 400, false, 'Authentication failed. No field can be empty!');
        }
      } else {
        Auth.responseData(res, 409, false, 'User already exists');
      }
    });
  }
};
module.exports = Auth;
