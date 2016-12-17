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
  if (req.user && req.user.id) {
    const query = req.params.email || '';
    User.find({ email: { $regex: query } }).limit(10)
    .exec((err, result) => {
      if (err) {
        return res.status(500).json(err);
      } else if (!result) {
        // hope this never happens.
        return res.status(404).send('I did not find any data');
      }
      return res.status(200).json(result);
    });
  } else {
    return res.status(404).json({ message: 'You do not have permission to visit this route'});
  }
};
