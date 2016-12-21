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
      const game = new Game({
        game_id: gameId,
        creator: req.body.creator,
        winner: {},
        rounds: 0,
        friends: req.body.friends,
        date_created: new Date(),
        completed: false
      });
      game.save((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'An error occured while trying to save',
            error: err
          });
        }
        return res.status(200).json(game);
      });
  },
  update(req, res) {
    const gameCreator = req.body.creator;
    const gameId = req.params.id;
    const query = { $and: [
          { game_id: gameId }, { 'creator.id': gameCreator.id }
    ] };
      Game.update(query, {
        winner: req.body.winner,
        completed: req.body.status,
        rounds: req.body.rounds,
        friends: req.body.friends
      }, (err, result) => {
        if (err) return res.status(500).json({ message: 'An error occured while updating this data', error: err });
        return res.status(200).json({ message: 'Game updated sucessfully' });
      });
  },
  gameDetails(req, res) {
    const userId = req.params.userid;
    const gameId = req.params.gameid;
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
  },
  gameLog(req, res) {
    const userId = req.params.userid;
      Game.find({
        $or: [
          { 'creator.id': userId }, { 'friends.id': userId }
        ]
      }).sort({_id: -1})
      .exec((err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'An error occured while trying to search for result'
          });
        }
        return res.status(200).json({ result });
      });
  }
};

module.exports = GameServices;
