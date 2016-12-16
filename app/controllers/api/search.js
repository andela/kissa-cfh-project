/* eslint amd:true */
/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * Gets all users from the database
 */

const searchUsers = {
  users(req, res) {
    if (req.user && req.user.id) {
      const query = req.params.email || '';
      User.find({ email: { $regex: query } }).limit(10)
      .exec((err, result) => {
        if (err) {
          return res.status(500).json({ message: 'An error occured while searching for users', error: err });
        } else if (!result) {
          // hope this never happens.
          return res.status(404).send('I did not find any data');
        }
        return res.status(200).json(result);
      });
    } else {
      return res.status(404).json({ message: 'You do not have permission to visit this route' });
    }
  },
  addFriend(req, res) {
    if (req.user && req.user.id) {
      const query = req.user.id;
      const friendEmail = req.body.friendEmail;
      User.findById(query, (err, userDetails) => {
        if (err) return res.status(500).json({ message: 'An error occured while trying to find your details', error: err });
        if (userDetails.friends.indexOf(friendEmail) >= 0) {
          return res.status(401).json({ message: 'User is already friends' });
        }
        userDetails.friends.push(friendEmail);
        userDetails.save((err, result) => {
          if (err) return res.status(500).json({ message: 'An error occured while trying to add this friend', error: err });
          return res.status(200).json({ message: 'Friend has been added successfully' });
        });
      });
    } else {
      return res.status(403).json({ message: 'You do not have permission to access this route' });
    }
  },
  searchFriends(req, res) {
    if (req.user && req.user.id) {
      const query = req.params.email;
      User.findById(req.user.id, (err, user) => {
        const friendEmail = user.friends;
        if (err) return res.send(500, { message: err.errors });
        User.find({
          $and: [
            { email: { $regex: query } },
            { email: { $in: user.friends } }
          ] }, (err, friends) => {
          if (err) {
            return res.status(500).json({ message: 'could not query your database', error: err });
          } else if (!friends) {
            return res.status(404).json({ message: 'You do not have any friends saved yet' });
          }
          return res.status(200).json(friends);
        });
      });
    } else {
      res.status(403).json({ message: 'You are not permitted to perform this search' });
    }
  }
};

module.exports = searchUsers;
