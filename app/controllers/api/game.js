/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
/* eslint amd:true */
/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Game = mongoose.model('Game');

const GameServices = {
  create(req, res) {
    const gameId = req.params.id;
    if (req.user && req.user.id) {
      const game = new Game({
        game_id: gameId,
        creator: req.body.creator,
        winner: '',
        rounds: 0,
        friends: req.body.friends,
        date_created: new Date(),
        completed: 'false'
      });
      game.save((err) => {
        if (err) {
          return res.status(500).json({
            message: 'An error occured while trying to save'
          });
        }
        return res.status(200).json(game);
      });
    } else {
      return res.status(403).json({ message: 'you do not have permission to access this route' });
    }
  },
  update(req, res) {
    const gameCreator = req.body.creator;
    const gameId = req.params.id;
    const query = { $and: [
          { game_id: gameId }, { creator: gameCreator }
    ] };
    if (req.user && req.user.id) {
      Game.update(query, {
        winner: req.body.winner,
        completed: req.body.status,
        rounds: req.body.rounds
      }, (err, result) => {
        if (err) return res.status(500).json({ message: 'An error occured while updating this data', error: err });
        return res.status(200).json({ message: 'Game updated sucessfully' });
      });
    } else {
      return res.status(403).json({ message: 'you do not have permission to access this route' });
    }
  },
  viewOne(req, res) {
    const userId = req.params.userid;
    const gameId = req.params.gameid;
    if (req.user && req.user.id) {
      Game.findOne({ _id: gameId })
      .exec((err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'An error occured while trying to search for result'
          });
        }
        return res.status(200).json({
          result
        });
      });
    }
  },
  viewAll(req, res) {
    const userId = req.params.userid;
    if (req.user && req.user.id) {
      Game.find({
        $or: [
          { creator: userId }, { friends: userId }
        ]
      })
      .exec((err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'An error occured while trying to search for result'
          });
        }
        return res.status(200).json({ result });
      });
    }
  }
};

module.exports = GameServices;
