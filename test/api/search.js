/* eslint amd:true */
const app = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');

const User = mongoose.model('User');

let user = '';

describe('Search api', () => {
  beforeEach((done) => {
    user = new User({
      name: 'Full name',
      email: 'search@search.com',
      username: 'user',
      password: 'password'
    });
    user.save(done);
  });

  afterEach((done) => {
    done();
  });

  describe('login route', () => {
    it('should login for valid user', (done) => {
      request(app).post('/users/session')
        .send({ email: user.email, password: user.password })
        .expect(302, done());
    });
  });

  describe('Search route', () => {
    it('routes successfully', (done) => {
      request(app)
        .get('/api/search/users/search@search.com')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
        });
      done();
    });
    it('returns not found when no word is entered', (done) => {
      request(app)
        .get('/api/search/users/')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
        });
      done();
    });
  });
});
