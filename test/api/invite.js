/* eslint amd:true */
const app = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');

const User = mongoose.model('User');

let user = '';

describe('Invite API', () => {
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
  describe('Send invite', () => {
    it('should login for valid user', (done) => {
      request(app).post('/users/session')
        .send({ email: user.email, password: user.password })
        .expect(302, done());
    });
    it('should send invites successfully', (done) => {
      request(app)
        .post('/api/invite/user')
        .send({ email: 'test@test.com', link: 'https://google.com' })
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
        });
      done();
    });
  });
});
