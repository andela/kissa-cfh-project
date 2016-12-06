/* eslint amd:true */
const mongoose = require('mongoose');

const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

//  signup method
module.exports.signUp = (request, response) => {
  //  json data to be sent to user
  function responseData(success, message, token) {
    response.json({
      success,
      message,
      token
    });
  }

  //  save the user in the database
  function saveUser(user) {
    user.save((err, newUser) => {
      if (err) return err;
      const token = jwt.sign(newUser, process.env.secret, {
        expiresIn: '24h'
      });
      responseData(true, 'You have successfully signed up!', token);
    });
  }

  User.findOne({ email: request.body.email }, (error, registeredUser) => {
    if (error) return error;
    // Check if email does not exists
    if (!registeredUser) {
      const body = request.body;
      if (body.email && body.name && body.password) {
        const user = new User();
        user.email = body.email;
        user.name = body.name;
        user.password = body.password;
        user.avatar = body.avatar;
        saveUser(user);
      } else {
        responseData(false, 'Authentication failed. No field can be empty!');
      }
    } else {
      responseData(false, 'User already available');
    }
  });
};
