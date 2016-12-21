/* eslint amd:true */
/**
 * Module Depedencies
 */
const should = require('should');
const app = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Game = mongoose.model('Game');
const agent = request.agent(app);

let gameData;

describe('Game Test', () => {
  before((done) => {
    User.remove().exec();
    Game.remove().exec();
    const user1 = new User({
      name: 'Full name',
      email: 'search@search.com',
      username: 'user',
      password: 'password'
    });
    gameData = {
      creator: 'Victor',
      friends: ['mike', 'victor', 'israel']
    };
    user1.save();
    agent.post('/users/session')
    .send({ email: user1.email, password: user1.password })
    .end((err, res) => {
      if (err) return done(err);
      res.should.have.status(302);
      done();
    });
  });

  it('should save game details for a logged in user', (done) => {
    const gameId = 'BzGy12';
    agent
    .post(`/api/games/${gameId}/start`)
    .send(gameData)
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });

  it('should update game when the game is finished', (done) => {
    const gameId = 'BzGy12';
    agent.put(`/api/games/${gameId}/start`)
    .type('form')
    .send({
      winner: 'Victor',
      status: 'true',
      rounds: 10
    })
    .end((err, res) => {
      if (err) return done(err);
      res.should.have.status(200);
      done();
    });
  });
});
