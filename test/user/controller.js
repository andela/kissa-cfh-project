/* eslint-disable amd, */
const app = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');
const users = require('../../app/controllers/users');

const User = mongoose.model('User');

let user = '';

describe('User Authentication', () => {
  beforeEach((done) => {
    user = new User({
      name: 'Full name',
      email: 'test@tesing.com',
      username: 'user1',
      password: 'password'
    });
    user.save(done);
  });

  afterEach((done) => {
    done();
  });
  describe('Login', () => {
    it('should redirect to login page when login is click', (done) => {
      request(app).get('/signin')
        .expect(302, done());
    });

    it('should login for valid user', (done) => {
      request(app).get('/signin', (req, res) => {
        users.session(req, res);
        res.send();
      });
      request(app).expect(302, done());
    });
  });
  describe('SignUp', () => {
    it('should rediret to the sign up page when sign up is click', (done) => {
      request(app).get('/signup')
        .expect(302, done());
    });

    it('should sign up when valid data is passed', (done) => {
      request(app).post('/users', users.create)
        .send({
          name: 'Full name',
          email: 'test@tesing.com',
          username: 'user1',
          password: 'password'
        })
        .expect(302, done());
    });
  });
});
