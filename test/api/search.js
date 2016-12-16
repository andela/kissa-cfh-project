/* eslint amd:true */
const should = require('should');
const app = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const agent = request.agent(app);

let user;
let user2;

describe('Search api', () => {
  before((done) => {
    User.remove().exec();
    user = new User({
      name: 'Full name',
      email: 'boss@boss.com',
      username: 'user',
      password: 'password'
    });
    user2 = new User({
        name: 'New Friend',
        email: 'newfriend@friends.com',
        username: 'user',
        password: 'password'
      });
    user.save();
    user2.save();
    agent.post('/users/session')
    .send({ email: user.email, password: user.password })
    .end((err, res) => {
      if (err) return done(err);
      res.should.have.status(302);
      done();
    });
  });

  describe('Search route', () => {
    it('routes successfully', (done) => {
      agent
      .get('/api/search/users/boss@boss.com')
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (err) return done(err);
        res.should.have.status(200);
        done();
      });
    });
    it('returns not found when no word is entered', (done) => {
      agent
      .get('/api/search/users/')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) return done(err);
        res.should.have.status(404);
      });
      done();
    });
    it('should not search for anything when the user is not logged in', (done) => {
      request(app)
      .get('/api/search/users/')
      .end(function(err, res) {
        if (err) return done(err);
        res.should.have.status(404);
      });
      done();
    });
    it('should add a user as friend', (done) => {
      agent
      .post('/api/users/friends')
      .send({ friendEmail: user2.email })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        done();
      });
    });
    it('should return an error when trying to add an already added user as friend', (done) => {
      agent
      .post('/api/users/friends')
      .send({ friendEmail: user2.email })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(401);
        done();
      });
    });
    it('should not add friend if the user is not logged in', (done) => {
      request(app)
      .post('/api/users/friends')
      .send({ friendEmail: user2.email })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(403);
        done();
      });
    });
    it('should return the list of user\'s friend', (done) => {
      const email = user2.email;
      agent
      .get(`/api/search/users/friends/${email}`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        done();
      });
    });
    it('should return an error when a non logged in user tries to serach for friends', (done) => {
      const email = user2.email;
      request(app)
      .get(`/api/search/users/friends/${email}`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(403);
        done();
      });
    });
  });
});