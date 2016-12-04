/* eslint amd:true */
const mongoose = require('mongoose');

const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const config = require('../../../config/env/all');
//  signup method
module.exports.signUp = (req, res) => {
  User.findOne({ email: req.body.email }, (err, registeredUser) => {
    if (err) return err;
    // Check if email does not exists
    if (!registeredUser) {
      const email = req.body.email;
      const name = req.body.name;
      const password = req.body.password;
      const avatar = req.body.avatar;
      if (email && name && password) {
        const user = new User();
        user.email = email;
        user.name = name;
        user.password = password;
        user.avatar = avatar;
        //  save the user in the database
        user.save((err, newUser) => {
          if (err) return err;
          const token = jwt.sign(newUser, config.secret, {
            expiresIn: '24h'
          });
          res.json({
            success: true,
            message: 'You have successfully signed up!',
            token
          });
        });
      } else {
        res.json({
          success: false,
          message: 'Authentication failed. No field can be empty!'
        });
      }
    } else {
      res.json({
        success: false,
        message: 'User already available'
      });
    }
  });
};
