/* eslint amd:true */
const should = require('should');
const app = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const agent = request.agent(app);

let user;
let user2;
let messageDetails;
const objectId = new mongoose.Types.ObjectId();
const secondUserId = new mongoose.Types.ObjectId();

describe('Invite API', () => {
  describe('Send invite', () => {
    before((done) => {
      User.remove().exec();
      user = new User({
        name: 'Full name',
        email: 'search@search.com',
        username: 'user',
        password: 'password'
      });
      user2 = new User({
        _id: secondUserId,
        name: 'New Player',
        email: 'newplayer@players.com',
        username: 'user',
        password: 'password'
      });
      messageDetails = {
        _id: objectId,
        link: 'http://localhost:3000/app?custom=GYQl1g6',
        email: user2.email,
        sender: user.email,
        userId: secondUserId
      };
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

    it('should send invites successfully', (done) => {
      agent
      .post('/api/users/email-invite')
      .send({ email: 'test@test.com', link: 'https://google.com' })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
      });
      done();
    });
    it('should send an in-app message to a user with friends', (done) => {
      agent
      .post('/api/users/send-message')
      .send(messageDetails)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        done();
      });
    });
    it('should return all the list of messages that has not been read for a user', (done) => {
      agent
      .get('/api/users/get-messages')
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        done();
      });
    });
    it('should update a message as read when the user reads the message', (done) => {
      agent
      .get(`/api/users/view-message/${objectId}`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        done();
      });
    });
  });
});
