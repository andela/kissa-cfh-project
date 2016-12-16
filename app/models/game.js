/* eslint amd:true */
/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Game Schema
 */
const GameSchema = new Schema({
  game_id: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  winner: {
    type: String,
    default: ''
  },
  rounds: {
    type: Number,
    default: 0
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: String,
    default: ''
  },
  friends: Array,
});

mongoose.model('Game', GameSchema);
