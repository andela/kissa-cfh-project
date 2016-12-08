/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
/* eslint amd:true */

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * Gets all users from the database
 */
exports.users = (req, res) => {
  const query = req.params.email || '';
  User.find({ email: { $regex: query } }).limit(10)
    .exec((err, result) => {
      if (err) {
        return res.status(500).json(err);
      } else if (!result) {
        // hope this never happens.
        return res.status(404).send('I did not find any data');
      }
      res.status(200).json(result);
    });
};
