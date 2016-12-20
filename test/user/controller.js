/* eslint-disable amd, import/no-unresolved*/
const app = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');
const users = require('../../app/controllers/users');

const User = mongoose.model('User');

var user = '';

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
    it('should redirect to login page when login is clicked', (done) => {
      request(app).get('/signin')
        .expect(302, done());
    });

    it('should login for valid user', (done) => {
      request(app).post('/users/session')
        .type('form')
        .send({
          email: 'test@tesing.com',
          password: 'password'
        })
        .expect(302)
        .end((err, res) => {
          done();
        });
    });
  });
  describe('SignUp', () => {
    it('should redirect to the sign up page when sign up is clicked', (done) => {
      request(app).get('/signup')
        .expect(302, done());
    });

    it('should sign up when valid data is passed', (done) => {
      request(app).post('/users')
        .type('form')
        .send({
          name: 'Full name',
          email: 'test@tesing.com',
          username: 'user1',
          password: 'password'
        })
        .expect(302)
        .end((err, res) => {
          done();
        });
    });
  });
});
