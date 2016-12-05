/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
<<<<<<< HEAD
/* eslint amd:true */

=======
>>>>>>> 3dc3a20cae22c3b2397a41260a0903d411dfa38e
/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * Gets all users from the database
 */
exports.users = (req, res) => {
  if (req.user && req.user._id) {
    const query = req.params.email || '';
    User.find({ email: { $regex: query } }).limit(10)
      .exec((err, result) => {
        if (err) {
          return res.json(err);
        } else if (!result) {
          // hope this never happens.
          return res.send('I did not find any data');
        }
        res.json(result);
      });
  }
};
