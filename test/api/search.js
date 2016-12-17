/* eslint amd:true */
const should = require('should');
const app = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const agent = request.agent(app);

let user = '';

describe('Search api', () => {
  before((done) => {
    User.remove().exec();
    const user1 = new User({
      name: 'Full name',
      email: 'search@search.com',
      username: 'user',
      password: 'password'
    });
    user1.save();
    agent.post('/users/session')
    .send({ email: user1.email, password: user1.password })
    .end((err, res) => {
      if (err) return done(err);
      res.should.have.status(302);
      done();
    });
  });

  describe('Search route', () => {
    it('routes successfully', (done) => {
      agent
      .get('/api/search/users/search@search.com')
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
        done();
      });
    });
    it('should not search for anything when the user is not logged in', (done) => {
      request(app)
      .get('/api/search/users/')
      .end(function(err, res) {
        if (err) return done(err);
        res.should.have.status(404);
        done();
      });
    });
  });
});
