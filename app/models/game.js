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
    type: Object,
    required: true
  },
  winner: {
    type: Object,
    default: {}
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
    default: false
  },
  friends: Array,
});

mongoose.model('Game', GameSchema);
