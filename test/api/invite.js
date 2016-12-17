/* eslint amd:true */
const should = require('should');
const app = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const agent = request.agent(app);

let user = '';

describe('Invite API', () => {
  describe('Send invite', () => {
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

  it('should not send invites when a user is not logged in', (done) => {
    request(app)
    .post('/api/invite/user')
    .send({ email: 'test@test.com', link: 'https://google.com' })
    .end((err, res) => {
      res.should.have.status(403);
      done();
    });
  });
    it('should send invites successfully', (done) => {
      agent
      .post('/api/invite/user')
      .send({ email: 'test@test.com', link: 'https://google.com' })
      .end(function(err, res){
        if (err) return done(err);
        res.should.have.status(200);
      });
      done();
    });
  });
});
